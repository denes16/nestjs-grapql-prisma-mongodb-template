import { Test, TestingModule } from '@nestjs/testing';
import {
  AbilityAction,
  CaslAbilityFactoryService,
} from '../casl-ability-factory.service';
import { UserMock } from '../../../common/mocks/user.mock';

describe('CaslAbilityFactoryService', () => {
  let service: CaslAbilityFactoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CaslAbilityFactoryService],
    }).compile();
    service = module.get<CaslAbilityFactoryService>(CaslAbilityFactoryService);
  });

  describe('when user is a regular user', () => {
    it('only can read and update your user', () => {
      const ability = service.buildAbilityForUser(UserMock);
      expect(ability.can(AbilityAction.Read, 'User')).toBeTruthy();
      expect(ability.can(AbilityAction.Update, 'User')).toBeTruthy();
      expect(ability.can(AbilityAction.Delete, 'User')).toBeFalsy();
      expect(ability.can(AbilityAction.Create, 'User')).toBeFalsy();
      expect(ability.can(AbilityAction.Manage, 'User')).toBeFalsy();
    });
  });
});
