import { PureAbility, AbilityBuilder, subject } from '@casl/ability';
import { createPrismaAbility, PrismaQuery } from '@casl/prisma';
import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
type Model<T, TName extends string> = T & {
  modelName: string;
};
type Subjects<T extends Partial<Record<string, Record<string, unknown>>>> =
  | keyof T
  | {
      [K in keyof T]: Model<T[K], K & string>;
    }[keyof T];
export type AppSubjects = Subjects<{
  User: User;
}>;

export enum AbilityAction {
  Manage = 'manage',
  Create = 'create',
  Read = 'read',
  Update = 'update',
  Delete = 'delete',
}

export type AppAbility = PureAbility<[AbilityAction, AppSubjects], PrismaQuery>;

@Injectable()
export class CaslAbilityFactoryService {
  buildAbilityForUser(user: User) {
    const { can, cannot, build } = new AbilityBuilder<AppAbility>(
      createPrismaAbility,
    );
    can([AbilityAction.Read, AbilityAction.Update], 'User', { id: user.id });
    return build({
      detectSubjectType: (item) =>
        (typeof item === 'string' ? item : item.modelName) as any,
    });
  }
}
