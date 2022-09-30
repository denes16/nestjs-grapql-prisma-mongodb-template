import { SetMetadata } from '@nestjs/common';
import {
  AbilityAction,
  AppAbility,
  AppSubjects,
} from '../casl-ability-factory.service';

interface IPolicyHandler {
  handle(ability: AppAbility): boolean;
}

type PolicyHandlerCallback = (ability: AppAbility) => boolean;

export type PolicyHandler = IPolicyHandler | PolicyHandlerCallback;
export const NEEDS_PERMISSIONS_KEY = 'needsPermissions';
// export const NeedsPermissions = (...handlers: PolicyHandler[]) =>
//   SetMetadata(CHECK_POLICIES_KEY, handlers);
export const NeedsPermission = (action: AbilityAction, subject: AppSubjects) =>
  SetMetadata(NEEDS_PERMISSIONS_KEY, [
    (ability: AppAbility) => ability.can(action, subject),
  ]);
