import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../auth.service';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../../core/services/prisma/prisma.service';
import { SignInInputMock } from './mocks/singInInput.mock';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ConflictException, ForbiddenException } from '@nestjs/common';
import { AuthResponseMock } from './mocks/authResponse.mock';
import { SignUpInputMock } from './mocks/signUpInput.mock';

describe('AuthService', () => {
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService, JwtService, PrismaService, ConfigService],
    }).compile();

    authService = module.get<AuthService>(AuthService);
  });

  describe('signIn', () => {
    it('should be successful', async () => {
      jest
        .spyOn(authService, 'signIn')
        .mockImplementation(
          () => new Promise((resolve) => resolve(AuthResponseMock)),
        );
      expect(await authService.signIn(SignInInputMock)).toBe(AuthResponseMock);
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
  describe('signUp', () => {
    it('should be successful', async () => {
      jest
        .spyOn(authService, 'signUp')
        .mockImplementation(
          () => new Promise((resolve) => resolve(AuthResponseMock)),
        );
      expect(await authService.signUp(SignUpInputMock)).toBe(AuthResponseMock);
    });
    it('should be email already exists error', () => {
      jest
        .spyOn(authService, 'signUp')
        .mockImplementation(
          () =>
            new Promise((resolve, reject) =>
              reject(new ConflictException('errors.emailAlreadyExists')),
            ),
        );
      expect(authService.signUp(SignUpInputMock)).rejects.toThrow(
        ConflictException,
      );
    });
  });
});
