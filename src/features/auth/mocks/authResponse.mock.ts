import { AuthResponse } from '../models/auth-response.model';
import { UserMock } from '../../../common/mocks/user.mock';

export const AuthResponseMock: AuthResponse = {
  accessToken: 'eyJhbGciOiJIU',
  refreshToken: 'eyJhbGciOiJIU',
  user: UserMock,
};
