import { Test, TestingModule } from '@nestjs/testing';
import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';
import { AuthResponseMock } from './mocks/authResponse.mock';
import { SignInInputMock } from './mocks/singInInput.mock';
import { SignUpInputMock } from './mocks/signUpInput.mock';

describe('AuthResolver', () => {
  let resolver: AuthResolver;
  let authService: AuthService;

  beforeEach(async () => {
    authService = {} as AuthService;
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthResolver,
        {
          provide: AuthService,
          useValue: authService,
        },
      ],
    }).compile();

    resolver = module.get<AuthResolver>(AuthResolver);
  });

  describe('signIn', () => {
    it('should be successful', async () => {
      authService.signIn = jest.fn().mockResolvedValue(AuthResponseMock);
      expect(await resolver.signIn(SignInInputMock)).toBe(AuthResponseMock);
    });
  });

  describe('signUp', function () {
    it('should be successful', async () => {
      authService.signUp = jest.fn().mockResolvedValue(AuthResponseMock);
      expect(await resolver.signUp(SignUpInputMock)).toBe(AuthResponseMock);
    });
  });
});
