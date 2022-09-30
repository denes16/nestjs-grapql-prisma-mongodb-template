import {
  CanActivate,
  Injectable,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AppAbility } from '../casl-ability-factory.service';
import {
  PolicyHandler,
  NEEDS_PERMISSIONS_KEY,
} from '../decorators/needs-permissions.decorator';
import { CurrentUser } from '../types/current-user.type';
import { GqlExecutionContext } from '@nestjs/graphql';
@Injectable()
export class PoliciesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const policyHandlers =
      this.reflector.get<PolicyHandler[]>(
        NEEDS_PERMISSIONS_KEY,
        context.getHandler(),
      ) || [];

    const { user } = GqlExecutionContext.create(context).getContext().req;
    const ability = (user as CurrentUser).ability;
    const result = policyHandlers.every((handler) =>
      this.execPolicyHandler(handler, ability),
    );
    if (!result) {
      throw new ForbiddenException('errors.403');
    }
    return true;
  }

  private execPolicyHandler(handler: PolicyHandler, ability: AppAbility) {
    if (typeof handler === 'function') {
      return handler(ability);
    }
    return handler.handle(ability);
  }
}
