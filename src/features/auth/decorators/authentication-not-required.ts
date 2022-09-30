import { SetMetadata } from '@nestjs/common';

export const AUTHENTICATION_NOT_REQUIRED_KEY = 'authenticationNotRequired';
export const AuthenticationNotRequired = () =>
  SetMetadata(AUTHENTICATION_NOT_REQUIRED_KEY, true);
