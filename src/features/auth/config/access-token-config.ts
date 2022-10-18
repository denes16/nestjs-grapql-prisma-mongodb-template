import { JwtSignOptions } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

export const GetAccessTokenConfig = (
  configService: ConfigService,
): JwtSignOptions => ({
  secret: configService.get('ACCESS_TOKEN_SECRET'),
  expiresIn: configService.get('ACCESS_TOKEN_EXPIRES_IN'),
});
