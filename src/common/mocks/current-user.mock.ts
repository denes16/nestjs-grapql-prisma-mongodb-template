import { CurrentUser } from '../../features/auth/types/current-user.type';
import { CaslAbilityFactoryService } from '../../features/auth/casl-ability-factory.service';
import { UserMock } from './user.mock';

export const CurrentUserMock: CurrentUser = {
  id: '1',
  user: UserMock,
  ability: new CaslAbilityFactoryService().buildAbilityForUser(UserMock),
  getAccessibleWhereInput: () => ({} as any),
};
