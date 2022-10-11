import { JwtSignOptions } from '@nestjs/jwt';
export const RefreshTokenConfig: JwtSignOptions = {
  secret: process.env.REFRESH_TOKEN_SECRET,
  expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN,
};

export enum RefreshToken {
  Secret = 'REFRESH_TOKEN_SECRET',
  ExpiresIn = 'REFRESH_TOKEN_EXPIRES_IN',
};

