import { accessibleBy } from '@casl/prisma';
import { WhereInputPerModel } from '@casl/prisma/dist/types/prismaClientBoundTypes';
import { User } from '@prisma/client';
import {
  AppAbility,
  AppSubjects,
  AbilityAction,
} from '../casl-ability-factory.service';
accessibleBy;

export type CurrentUser = {
  id: string;
  user: User;
  ability: AppAbility;
  authAccessToken?: string;
  authRefreshToken?: string;
  getAccessibleWhereInput: (
    subject: AppSubjects,
    action?: AbilityAction,
  ) => WhereInputPerModel;
};
