import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { PrismaService } from '../../core/services/prisma/prisma.service';
import { CurrentUserMock } from '../../common/mocks/current-user.mock';
import { UserMock } from '../../common/mocks/user.mock';

describe('UsersService', () => {
  let service: UsersService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    prismaService = {
      user: {
        findUnique: jest.fn(),
        update: jest.fn(),
      } as any,
    } as PrismaService;
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: PrismaService,
          useValue: prismaService,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should call prismaService.findUnique on findOne', async () => {
    const findOneSpy = jest
      .spyOn(prismaService.user, 'findUnique')
      .mockResolvedValue(UserMock);
    const result = await service.findOne('1', CurrentUserMock);
    expect(findOneSpy).toBeCalledTimes(1);
    expect(result).toBe(UserMock);
  });

  it('should call prismaService.update on update', async () => {
    jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(UserMock);
    const updateSpy = jest.spyOn(prismaService.user, 'update');
    const data = { id: '1', firstName: 'tania', lastName: 'mijangos' };
    await service.update(data, CurrentUserMock);
    expect(updateSpy).toBeCalledTimes(1);
  });
});
