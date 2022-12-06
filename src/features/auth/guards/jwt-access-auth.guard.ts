import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import { AUTHENTICATION_NOT_REQUIRED_KEY } from '../decorators/authentication-not-required';
import { GqlExecutionContext } from '@nestjs/graphql';
import { getI18nContextFromRequest } from 'nestjs-i18n';
import { PoliciesGuard } from './policies.guard';

@Injectable()
export class JwtAccessAuthGuard extends AuthGuard([
  'google-token',
  'jwt-access',
]) {
  constructor(
    private reflector: Reflector,
    private policiesGuard: PoliciesGuard,
  ) {
    super();
  }
  getRequest(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context);
    const req = ctx.getContext().req;
    const i18nContext = getI18nContextFromRequest(req);
    req.i18nContext = i18nContext;
    return ctx.getContext().req;
  }
  getResponse(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context);
    const res = ctx.getContext().req.res;
    let wantsToRedirect = false;
    const realSetHeader = res.setHeader;
    res.setHeader = (header, value) => {
      if (header === 'Location') {
        wantsToRedirect = true;
      } else {
        realSetHeader.call(res, header, value);
      }
    };
    const realEnd = res.end;
    res.end = (...params) => {
      if (wantsToRedirect) {
        wantsToRedirect = false;
        res.status(200).json({
          errors: [
            {
              message: 'Unauthorized',
              extensions: {
                code: 'UNAUTHENTICATED',
                response: {
                  statusCode: 401,
                  message: 'Unauthorized',
                },
              },
            },
          ],
          data: null,
        });
        return;
      }
      realEnd.apply(res, params);
    };
    return res;
  }
  async logIn() {
    throw new UnauthorizedException();
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
