import {
  Injectable,
  ConflictException,
  ForbiddenException,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from '../../core/services/prisma/prisma.service';
import { SignUpInput } from './dto/sign-up.input';
import { compare, hash } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { User, AuthProvider } from '@prisma/client';
import { GetAccessTokenConfig } from './config/access-token-config';
import { AuthResponse } from './models/auth-response.model';
import { SignInInput } from './dto/sign-in.input';
import { CurrentUser } from './types/current-user.type';
import { ConfigService } from '@nestjs/config';
import { GetRefreshTokenConfig } from './config/refresh-token-config';
import { ForgotPasswordInput } from './dto/forgot-password.input';
import { ResetPasswordTokenInput } from './dto/reset-password-token.input';
import { ResetPasswordInput } from './dto/reset-password.input';
import { MailerService } from '@nestjs-modules/mailer';
import { ForgotPasswordResponse } from './models/forgot-password-response.model';
import { I18nService } from 'nestjs-i18n';
import * as crypto from 'crypto';
import * as handlebars from 'handlebars';

@Injectable()
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private mailService: MailerService,
    private i18nService: I18nService,
  ) {}

  async signUp(signUpInput: SignUpInput): Promise<AuthResponse> {
    const existingUser = await this.prismaService.user.findFirst({
      where: {
        email: signUpInput.email,
        authProvider: AuthProvider.LOCAL,
      },
      select: {
        id: true,
      },
    });
    if (existingUser) {
      throw new ConflictException('errors.emailAlreadyExists');
    }
    const user = await this.prismaService.user.create({
      data: {
        firstName: signUpInput.firstName,
        lastName: signUpInput.lastName,
        email: signUpInput.email,
        password: await hash(signUpInput.password, 10),
      },
    });
    return {
      user,
      accessToken: await this.buildAccessToken(user),
      refreshToken: await this.buildRefreshToken(user),
    };
  }

  async signIn(signInInput: SignInInput): Promise<AuthResponse> {
    const user = await this.prismaService.user.findFirst({
      where: {
        email: signInInput.email,
        authProvider: AuthProvider.LOCAL,
      },
    });
    if (!user) {
      throw new ForbiddenException('errors.badCredentials');
    }
    const isPasswordValid = await this.validatePassword(
      user,
      signInInput.password,
    );
    if (!isPasswordValid) {
      throw new ForbiddenException('errors.badCredentials');
    }
    return {
      user,
      accessToken: await this.buildAccessToken(user),
      refreshToken: await this.buildRefreshToken(user),
    };
  }

  async refreshAccessToken(currentUser: CurrentUser): Promise<AuthResponse> {
    return {
      accessToken: await this.buildAccessToken(currentUser.user),
      user: await this.prismaService.user.findUniqueOrThrow({
        where: {
          id: currentUser.id,
        },
      }),
    };
  }

  private removeFieldsFromUserAndJwtPayload(user: any): User {
    delete user.iat;
    delete user.exp;
    return {
      ...user,
      password: undefined,
    } as User;
  }

  async buildAccessToken(user: User): Promise<string> {
    return this.jwtService.sign(
      this.removeFieldsFromUserAndJwtPayload(user),
      GetAccessTokenConfig(this.configService),
    );
  }

  async buildRefreshToken(user: User): Promise<string> {
    return this.jwtService.sign(
      this.removeFieldsFromUserAndJwtPayload(user),
      GetRefreshTokenConfig(this.configService),
    );
  }

  private async validatePassword(
    user: User,
    password: string,
  ): Promise<boolean> {
    return await compare(password, user.password);
  }

  async forgotPassword(
    forgotPasswordInput: ForgotPasswordInput,
  ): Promise<ForgotPasswordResponse> {
    const userUpdated = await this.generateResetPasswordToken(
      forgotPasswordInput.email,
    );
    if (userUpdated) {
      handlebars.registerHelper('t', (key: string) => {
        return this.i18nService.translate(key, {
          lang: userUpdated.language,
        });
      });
      await this.mailService.sendMail({
        to: userUpdated.email,
        from: this.configService.get('MAIL_FROM'),
        subject: this.i18nService.translate('common.resetPassword', {
          lang: userUpdated.language,
        }),
        template: 'password-reset',
        context: {
          url: `${this.configService.get(
            'FRONTEND_URL',
          )}/reset-password?token=${userUpdated.resetPasswordToken}`,
        },
      });
    }
    return {
      email: null,
    };
  }

  async verifyResetPasswordToken(
    resetPasswordTokenInput: ResetPasswordTokenInput,
  ): Promise<ForgotPasswordResponse> {
    const user = await this.prismaService.user.findUnique({
      where: {
        resetPasswordToken: resetPasswordTokenInput.token,
      },
    });
    if (!user) {
      throw new ForbiddenException('errors.invalidToken');
    }
    if (user.resetPasswordTokenExpires < new Date()) {
      throw new ForbiddenException('errors.tokenExpired');
    }
    return {
      email: user.email,
    };
  }

  private async generateResetPasswordToken(
    email: string,
  ): Promise<User | null> {
    const token = this.generateToken(70);
    return await this.prismaService.user.update({
      where: { email },
      data: {
        resetPasswordToken: token,
        resetPasswordTokenExpires: new Date(Date.now() + 3600000),
      },
    });
  }

  private generateToken(length: number): string {
    return crypto.randomBytes(length).toString('hex');
  }

  async resetPassword(
    resetPasswordInput: ResetPasswordInput,
  ): Promise<ForgotPasswordResponse> {
    const { email, ...rest } = await this.verifyResetPasswordToken({
      token: resetPasswordInput.token,
    });
    const user = await this.prismaService.user.update({
      where: { email },
      data: {
        password: await hash(resetPasswordInput.password, 10),
        resetPasswordToken: null,
      },
    });
    if (!user) {
      throw new InternalServerErrorException('errors.internalServerError');
    }
    return {
      email: user.email,
    };
  }
}
