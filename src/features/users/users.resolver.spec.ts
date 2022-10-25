import { Test, TestingModule } from '@nestjs/testing';
import { UsersResolver } from './users.resolver';
import { UsersService } from './users.service';
import { CurrentUserMock } from '../../common/mocks/current-user.mock';

describe('UsersResolver', () => {
  let resolver: UsersResolver;
  let usersService: UsersService;

  beforeEach(async () => {
    usersService = {
      findOne: jest.fn() as any,
    } as UsersService;
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersResolver,
        {
          provide: UsersService,
          useValue: usersService,
        },
      ],
    }).compile();

    resolver = module.get<UsersResolver>(UsersResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
  it('should call usersService.findOne on findOne', () => {
    const findOneSpy = jest.spyOn(usersService, 'findOne');
    resolver.findOne('1', CurrentUserMock);
    expect(findOneSpy).toHaveBeenCalledWith('1', CurrentUserMock);
  });
});
