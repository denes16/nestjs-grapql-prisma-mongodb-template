import { JwtSignOptions } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

export const GetRefreshTokenConfig = (
  configService: ConfigService,
): JwtSignOptions => ({
  secret: configService.get('REFRESH_TOKEN_SECRET'),
  expiresIn: configService.get('REFRESH_TOKEN_EXPIRES_IN'),
});
