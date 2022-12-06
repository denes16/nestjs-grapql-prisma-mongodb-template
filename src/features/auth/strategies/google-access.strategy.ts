import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { AuthProvider, User } from '@prisma/client';
import { CurrentUser } from '../types/current-user.type';
import { CaslAbilityFactoryService } from '../casl-ability-factory.service';
import { accessibleBy } from '@casl/prisma';
import { ConfigService } from '@nestjs/config';
import { Strategy } from 'passport-google-oauth20';
import { PrismaService } from 'src/core/services/prisma/prisma.service';

@Injectable()
export class GoogleAccessStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    private readonly caslAbilityFactoryService: CaslAbilityFactoryService,
    private configService: ConfigService,
    private prismaService: PrismaService,
  ) {
    super({
      clientID: configService.get('GOOGLE_CLIENT_ID'),
      clientSecret: configService.get('GOOGLE_CLIENT_SECRET'),
      callbackURL: configService.get('GOOGLE_CALLBACK_URL'),
      accessType: 'offline',
      prompt: 'consent',
      scope: ['email', 'profile'],
      session: false,
    });
  }
  authorizationParams(): { [key: string]: any } {
    return {
      access_type: 'offline',
      prompt: 'consent',
      session: false,
    };
  }
  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
  ): Promise<CurrentUser> {
    const userId = profile.id;
    const email = profile.emails[0].value;
    const firstName = profile.name.givenName;
    const lastName = profile.name.familyName ?? '';
    let user = await this.prismaService.user.findFirst({
      where: {
        authProvider: AuthProvider.GOOGLE,
        authProviderId: userId,
      },
    });
    if (!user) {
      user = await this.prismaService.user.create({
        data: {
          email,
          firstName,
          lastName,
          authProvider: AuthProvider.GOOGLE,
          authProviderId: userId,
        },
      });
    }
    const ability = await this.caslAbilityFactoryService.buildAbilityForUser(
      user,
    );
    return {
      id: user.id,
      user: user,
      ability,
      authAccessToken: accessToken,
      authRefreshToken: refreshToken,
      getAccessibleWhereInput(subject, action?) {
        const subjectName =
          typeof subject === 'string' ? subject : subject.modelName;
        return accessibleBy(ability, action)[subjectName];
      },
    };
  }
}
