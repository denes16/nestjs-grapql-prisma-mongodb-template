import { AuthResponse } from '../../models/auth-response.model';

export const AuthResponseMock: AuthResponse = {
  accessToken: 'eyJhbGciOiJIU',
  refreshToken: 'eyJhbGciOiJIU',
  user: {
    id: '633653edc8c1e095415877de',
    firstName: 'cris',
    lastName: 'marca',
    email: 'dev@gmail.com',
    password: '$2b$10$',
    language: 'en',
    createdAt: new Date(),
    updatedAt: new Date(),
    isActive: true,
    modelName: 'User',
  },
};
