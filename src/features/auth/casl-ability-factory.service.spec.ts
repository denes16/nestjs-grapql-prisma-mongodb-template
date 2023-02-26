import { Test, TestingModule } from '@nestjs/testing';
import {
  AbilityAction,
  CaslAbilityFactoryService,
} from './casl-ability-factory.service';
import { UserMock } from '../../common/mocks/user.mock';
import { AppAbility } from './casl-ability-factory.service';

describe('CaslAbilityFactoryService', () => {
  let service: CaslAbilityFactoryService;
  let ability: AppAbility;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CaslAbilityFactoryService],
    }).compile();
    service = module.get<CaslAbilityFactoryService>(CaslAbilityFactoryService);
    ability = service.buildAbilityForUser(UserMock);
  });

  describe('when user is a regular user', () => {
    it('only can read and update itself', () => {
      expect(ability.can(AbilityAction.Read, 'User')).toBeTruthy();
      expect(ability.can(AbilityAction.Update, 'User')).toBeTruthy();

      expect(ability.can(AbilityAction.Delete, 'User')).toBeFalsy();
      expect(ability.can(AbilityAction.Create, 'User')).toBeFalsy();
      expect(ability.can(AbilityAction.Manage, 'User')).toBeFalsy();
    });
    it('cannot read and update other users', () => {
      const noSelf = { ...UserMock, id: 'otherId' };
      expect(ability.can(AbilityAction.Read, noSelf as any)).toBeFalsy();
      expect(ability.can(AbilityAction.Update, noSelf as any)).toBeFalsy();
    });
  });
});
