import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../auth.service';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../../core/services/prisma/prisma.service';
import { SignInInputMock } from './mocks/singInInput.mock';
import { AuthResponse } from '../models/auth-response.model';
import { SignInInput } from '../dto/sign-in.input';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ForbiddenException } from '@nestjs/common';

describe('AuthService', () => {
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule],
      providers: [AuthService, JwtService, PrismaService, ConfigService],
    }).compile();

    authService = module.get<AuthService>(AuthService);
  });

  describe('signIn', () => {
    it('should be successful', async () => {
      const result: AuthResponse = {
        accessToken: 'eyJhbGciOiJIU',
        refreshToken: 'eyJhbGciOiJIU',
        user: {
          id: '633653edc8c1e095415877de',
          firstName: 'cris',
          lastName: 'marca',
          email: 'email1@email.com',
          password: '$2b$10$',
          language: 'en',
          createdAt: new Date(),
          updatedAt: new Date(),
          isActive: true,
          modelName: 'User',
        },
      };
      jest
        .spyOn(authService, 'signIn')
        .mockImplementation(() => new Promise((resolve) => resolve(result)));
      expect(await authService.signIn(SignInInputMock)).toBe(result);
    });
    it('should be a bad credential error', () => {
      jest
        .spyOn(authService, 'signIn')
        .mockImplementation(
          () =>
            new Promise((resolve, reject) =>
              reject(new ForbiddenException('errors.badCredentials')),
            ),
        );
      expect(authService.signIn(SignInInputMock)).rejects.toThrow(
        ForbiddenException,
      );
    });
  });
});
