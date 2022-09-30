import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { RefreshTokenConfig } from '../config/refresh-token-config';
import { CaslAbilityFactoryService } from '../casl-ability-factory.service';
import { CurrentUser } from '../types/current-user.type';
import { accessibleBy } from '@casl/prisma';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(
    private readonly caslAbilityFactoryService: CaslAbilityFactoryService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: RefreshTokenConfig.secret,
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
