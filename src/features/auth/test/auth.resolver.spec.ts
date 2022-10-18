import { Test, TestingModule } from '@nestjs/testing';
import { AuthResolver } from '../auth.resolver';
import { AuthService } from '../auth.service';
import { AuthResponseMock } from './mocks/authResponse.mock';
import { SignInInputMock } from './mocks/singInInput.mock';
import { PrismaService } from '../../../core/services/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { SignUpInputMock } from './mocks/signUpInput.mock';

describe('AuthResolver', () => {
  let resolver: AuthResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthResolver,
        AuthService,
        PrismaService,
        JwtService,
        ConfigService,
      ],
    }).compile();

    resolver = module.get<AuthResolver>(AuthResolver);
  });

  describe('signIn', () => {
    it('should be successful', async () => {
      jest
        .spyOn(resolver, 'signIn')
        .mockImplementation(
          () => new Promise((resolve) => resolve(AuthResponseMock)),
        );
      expect(await resolver.signIn(SignInInputMock)).toBe(AuthResponseMock);
    });
  });
  describe('signUp', function () {
    it('should be successful', async () => {
      jest
        .spyOn(resolver, 'signUp')
        .mockImplementation(
          () => new Promise((resolve) => resolve(AuthResponseMock)),
        );
      expect(await resolver.signUp(SignUpInputMock)).toBe(AuthResponseMock);
    });
  });
});
