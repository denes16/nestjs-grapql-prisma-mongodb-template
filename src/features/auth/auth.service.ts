import {
  Injectable,
  ConflictException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../../core/services/prisma/prisma.service';
import { SignUpInput } from './dto/sign-up.input';
import { compare, hash } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { GetAccessTokenConfig } from './config/access-token-config';
import { AuthResponse } from './models/auth-response.model';
import { SignInInput } from './dto/sign-in.input';
import { CurrentUser } from './types/current-user.type';
import { ConfigService } from '@nestjs/config';
import { GetRefreshTokenConfig } from './config/refresh-token-config';

@Injectable()
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}
  async signUp(signUpInput: SignUpInput): Promise<AuthResponse> {
    const existingUser = await this.prismaService.user.findUnique({
      where: {
        email: signUpInput.email,
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
    const user = await this.prismaService.user.findUnique({
      where: {
        email: signInInput.email,
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
}
