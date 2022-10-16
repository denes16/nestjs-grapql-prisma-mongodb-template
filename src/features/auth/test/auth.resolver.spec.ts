import { Test, TestingModule } from '@nestjs/testing';
import { AuthResolver } from '../auth.resolver';
import { AuthService } from '../auth.service';
import { AuthResponseMock } from './mocks/authResponse.mock';
import { SignInInputMock } from './mocks/singInInput.mock';
import { PrismaService } from '../../../core/services/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

describe('AuthResolver', () => {
  let resolver: AuthResolver;
  let authService: AuthService;

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
    authService = module.get<AuthService>(AuthService);
  });

  describe('signIn', () => {
    it('should be successful', async () => {
      jest
        .spyOn(authService, 'signIn')
        .mockImplementation(
          () => new Promise((resolve) => resolve(AuthResponseMock)),
        );
      expect(await resolver.signIn(SignInInputMock)).toBe(AuthResponseMock);
    });
  });
});
