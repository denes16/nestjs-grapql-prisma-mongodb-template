import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { AccessToken, AccessTokenConfig } from '../config/access-token-config';
import { User } from '@prisma/client';
import { CurrentUser } from '../types/current-user.type';
import { CaslAbilityFactoryService } from '../casl-ability-factory.service';
import { accessibleBy } from '@casl/prisma';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtAccessStrategy extends PassportStrategy(
  Strategy,
  'jwt-access',
) {
  constructor(
    private readonly caslAbilityFactoryService: CaslAbilityFactoryService,
    private configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get(AccessToken.Secret),
    });
  }

  async validate(payload: User): Promise<CurrentUser> {
    const ability = await this.caslAbilityFactoryService.buildAbilityForUser(
      payload,
    );
    return {
      id: payload.id,
      user: payload,
      ability,
      getAccessibleWhereInput(subject, action?) {
        const subjectName =
          typeof subject === 'string' ? subject : subject.modelName;
        return accessibleBy(ability, action)[subjectName];
      },
    };
  }
}
