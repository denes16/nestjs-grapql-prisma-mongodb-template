import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../core/services/prisma/prisma.service';
import { SignInInputMock } from './mocks/singInInput.mock';
import { ConfigService } from '@nestjs/config';
import { ConflictException, ForbiddenException } from '@nestjs/common';
import { AuthResponseMock } from './mocks/authResponse.mock';
import { SignUpInputMock } from './mocks/signUpInput.mock';
import { UserMock } from '../../common/mocks/user.mock';
import * as bcrypt from 'bcrypt';

describe('AuthService', () => {
  let authService: AuthService;
  let jwtService: JwtService;
  let prismaService: PrismaService;
  let configService: ConfigService;

  beforeEach(async () => {
    jwtService = {
      sign: jest.fn().mockResolvedValue('token') as any,
    } as JwtService;
    prismaService = {
      user: {} as any,
    } as PrismaService;
    configService = {
      get: jest.fn().mockReturnValue('secret') as any,
    } as ConfigService;
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: JwtService,
          useValue: jwtService,
        },
        {
          provide: PrismaService,
          useValue: prismaService,
        },
        {
          provide: ConfigService,
          useValue: configService,
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
  });

  describe('signIn', () => {
    it('should be successful', async () => {
      prismaService.user.findUnique = jest.fn().mockResolvedValue(UserMock);
      const spyCompare = jest
        .spyOn(bcrypt, 'compare')
        .mockImplementation(() => Promise.resolve(true));
      expect((await authService.signIn(SignInInputMock)).user).toBe(UserMock);
      expect(spyCompare).toBeCalled();
      spyCompare.mockRestore();
    });
    it('should throw a ForbiddenException no not found user', async () => {
      prismaService.user.findUnique = jest.fn().mockResolvedValue(null);
      await expect(authService.signIn(SignInInputMock)).rejects.toThrow(
        ForbiddenException,
      );
    });
    it('should throw a ForbiddenException no valid password', async () => {
      prismaService.user.findUnique = jest.fn().mockResolvedValue(UserMock);
      const spyCompare = jest
        .spyOn(bcrypt, 'compare')
        .mockImplementation(() => Promise.resolve(false));
      await expect(authService.signIn(SignInInputMock)).rejects.toThrow(
        ForbiddenException,
      );
      expect(spyCompare).toBeCalled();
      spyCompare.mockRestore();
    });
  });
  describe('signUp', () => {
    it('should be successful', async () => {
      prismaService.user.findUnique = jest.fn().mockResolvedValue(null);
      prismaService.user.create = jest.fn().mockResolvedValue(UserMock);
      const spyHash = jest
        .spyOn(bcrypt, 'hash')
        .mockImplementation(() => Promise.resolve('hash'));
      expect((await authService.signUp(SignUpInputMock)).user).toBe(UserMock);
      expect(spyHash).toBeCalled();
      spyHash.mockRestore();
    });
    it('should be email already exists error', () => {
      prismaService.user.findUnique = jest.fn().mockResolvedValue(UserMock);
      expect(authService.signUp(SignUpInputMock)).rejects.toThrow(
        ConflictException,
      );
    });
  });
});
