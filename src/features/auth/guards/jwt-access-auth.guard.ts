import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import { AUTHENTICATION_NOT_REQUIRED_KEY } from '../decorators/authentication-not-required';
import { GqlExecutionContext } from '@nestjs/graphql';
import { getI18nContextFromRequest } from 'nestjs-i18n';
import { PoliciesGuard } from './policies.guard';

@Injectable()
export class JwtAccessAuthGuard extends AuthGuard('jwt-access') {
  constructor(
    private reflector: Reflector,
    private policiesGuard: PoliciesGuard,
  ) {
    super();
  }
  getRequest(context: ExecutionContext) {
    console.log('JwtAccessAuthGuard.getRequest');
    const ctx = GqlExecutionContext.create(context);
    const req = ctx.getContext().req;
    const i18nContext = getI18nContextFromRequest(req);
    req.i18nContext = i18nContext;
    return ctx.getContext().req;
  }
  async canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(
      AUTHENTICATION_NOT_REQUIRED_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (isPublic) {
      return true;
    }
    const authenticated = await super.canActivate(context);
    if (typeof authenticated !== 'boolean') {
      throw new Error(
        'Result from jwt access guard is not a promise of boolean',
      );
    }
    if (authenticated) {
      const policies = await this.policiesGuard.canActivate(context);
      return policies;
    }
    return false;
  }
}
