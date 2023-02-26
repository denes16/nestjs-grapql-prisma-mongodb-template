import { PassportStrategy } from '@nestjs/passport';
import { Injectable, ConflictException } from '@nestjs/common';
import { AuthProvider, User } from '@prisma/client';
import { CurrentUser } from '../types/current-user.type';
import { CaslAbilityFactoryService } from '../casl-ability-factory.service';
import { accessibleBy } from '@casl/prisma';
import { ConfigService } from '@nestjs/config';
import * as Strategy from 'passport-google-id-token';
import { PrismaService } from '../../../core/services/prisma/prisma.service';
import fetch from 'node-fetch';

@Injectable()
export class GoogleAccessTokenStrategy extends PassportStrategy(
  Strategy,
  'google-token',
) {
  cachedCerts: any;
  cachedCertsExpiresAt: Date | undefined;
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
      getGoogleCerts: async (kid, cb) => {
        if (
          !this.cachedCerts ||
          !this.cachedCertsExpiresAt ||
          this.cachedCertsExpiresAt < new Date()
        ) {
          const response = await fetch(
            'https://www.googleapis.com/oauth2/v1/certs',
          );
          this.cachedCerts = await response.json();
          this.cachedCertsExpiresAt = new Date(
            new Date().getTime() +
              Number(
                response.headers
                  .get('cache-control')
                  ?.match(/max-age=(\d+)/)?.[1] ?? 0,
              ) *
                1000,
          );
        }
        cb(null, this.cachedCerts[kid]);
      },
    });
  }
  authorizationParams(): { [key: string]: any } {
    return {
      access_type: 'offline',
      prompt: 'consent',
      session: false,
    };
  }
  async validate(parsedToken: any, googleId: string): Promise<CurrentUser> {
    const profile = parsedToken.payload;
    const userId = googleId;
    const email = profile.email;
    const firstName = profile.name ?? '';
    const lastName = profile.family_name ?? '';
    let user = await this.prismaService.user.findFirst({
      where: {
        authProvider: AuthProvider.GOOGLE,
        authProviderId: userId,
      },
    });
    if (!user) {
      const existingUser = await this.prismaService.user.findFirst({
        where: {
          email,
        },
      });
      if (existingUser) {
        throw new ConflictException('errors.emailAlreadyExists');
      }
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
      authAccessToken: '',
      authRefreshToken: '',
      getAccessibleWhereInput(subject, action?) {
        const subjectName =
          typeof subject === 'string' ? subject : subject.modelName;
        return accessibleBy(ability, action)[subjectName];
      },
    };
  }
}
