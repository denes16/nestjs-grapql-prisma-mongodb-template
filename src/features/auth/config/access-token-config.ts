import { JwtSignOptions } from '@nestjs/jwt';

export const AccessTokenConfig: JwtSignOptions = {
  secret: process.env.ACCESS_TOKEN_SECRET,
  expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN,
};
