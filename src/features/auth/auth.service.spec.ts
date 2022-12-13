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
import { MailerService } from '@nestjs-modules/mailer';
import { ForgotPasswordInputMock } from './mocks/forgotPasswordInput.mock';
import { I18nService } from 'nestjs-i18n';
import { ForgotPasswordResponseMock } from './mocks/forgotPasswordResponse.mock';
import * as SMTPTransport from 'nodemailer/lib/smtp-transport';
import MailMessage from 'nodemailer/lib/mailer/mail-message';
import { ResetPasswordInputMock } from './mocks/resetPasswordInput.mock';
import { ResetPasswordTokenInput } from './dto/reset-password-token.input';
import { ResetPasswordTokenMock } from './mocks/resetPasswordToken.mock';

describe('AuthService', () => {
  let authService: AuthService;
  let jwtService: JwtService;
  let prismaService: PrismaService;
  let configService: ConfigService;
  let mailService: MailerService;
  let i18nService: I18nService;

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
    mailService = {
      sendMail: jest.fn().mockResolvedValue(true) as any,
    } as MailerService;
    i18nService = {
      translate: jest.fn().mockResolvedValue('translated') as any,
    } as I18nService;
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
        {
          provide: MailerService,
          useValue: mailService,
        },
        {
          provide: I18nService,
          useValue: i18nService,
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
  });

  describe('signIn', () => {
    it('should be successful', async () => {
      prismaService.user.findFirst = jest.fn().mockResolvedValue(UserMock);
      const spyCompare = jest
        .spyOn(bcrypt, 'compare')
        .mockImplementation(() => Promise.resolve(true));
      expect((await authService.signIn(SignInInputMock)).user).toBe(UserMock);
      expect(spyCompare).toBeCalled();
      spyCompare.mockRestore();
    });
    it('should throw a ForbiddenException no not found user', async () => {
      prismaService.user.findFirst = jest.fn().mockResolvedValue(null);
      await expect(authService.signIn(SignInInputMock)).rejects.toThrow(
        ForbiddenException,
      );
    });
    it('should throw a ForbiddenException no valid password', async () => {
      prismaService.user.findFirst = jest.fn().mockResolvedValue(UserMock);
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
      prismaService.user.findFirst = jest.fn().mockResolvedValue(null);
      prismaService.user.create = jest.fn().mockResolvedValue(UserMock);
      const spyHash = jest
        .spyOn(bcrypt, 'hash')
        .mockImplementation(() => Promise.resolve('hash'));
      expect((await authService.signUp(SignUpInputMock)).user).toBe(UserMock);
      expect(spyHash).toBeCalled();
      spyHash.mockRestore();
    });
    it('should be email already exists error', () => {
      prismaService.user.findFirst = jest.fn().mockResolvedValue(UserMock);
      expect(authService.signUp(SignUpInputMock)).rejects.toThrow(
        ConflictException,
      );
    });
  });

  describe('forgotPassword', () => {
    it('should be successful', async () => {
      prismaService.user.update = jest.fn().mockResolvedValue(UserMock);
      await authService.forgotPassword(ForgotPasswordInputMock);
      expect(mailService.sendMail).toBeCalledTimes(1);
    });
  });

  describe('resetPassword', () => {
    it('should be successful', async () => {
      prismaService.user.findUnique = jest.fn().mockResolvedValue({
        ...UserMock,
        resetPasswordTokenExpires: new Date(Date.now() + 10_000),
      });
      prismaService.user.update = jest.fn().mockResolvedValue(UserMock);
      const spyHash = jest
        .spyOn(bcrypt, 'hash')
        .mockImplementation(() => Promise.resolve('hash'));
      expect(
        await authService.resetPassword(ResetPasswordInputMock),
      ).toStrictEqual({
        email: UserMock.email,
      });
      expect(spyHash).toBeCalled();
    });
  });

  describe('verifyResetPasswordToken', () => {
    it('should be successful', async () => {
      prismaService.user.findUnique = jest.fn().mockResolvedValue({
        ...ResetPasswordTokenMock,
        email: ForgotPasswordResponseMock.email,
        resetPasswordTokenExpires: new Date(Date.now() + 10_000),
      });
      expect(
        await authService.verifyResetPasswordToken(ResetPasswordTokenMock),
      ).toStrictEqual(ForgotPasswordResponseMock);
    });

    it('should be token not found error', async () => {
      prismaService.user.findUnique = jest.fn().mockResolvedValue(null);
      await expect(
        authService.verifyResetPasswordToken(ResetPasswordTokenMock),
      ).rejects.toThrow(ForbiddenException);
    });

    it('should be token expired error', async () => {
      prismaService.user.findUnique = jest
        .fn()
        .mockResolvedValue(ResetPasswordTokenMock);
      await expect(
        authService.verifyResetPasswordToken(ResetPasswordTokenMock),
      ).rejects.toThrow(ForbiddenException);
    });
  });
});
