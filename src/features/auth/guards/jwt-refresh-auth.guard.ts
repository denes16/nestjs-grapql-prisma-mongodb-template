import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GqlExecutionContext } from '@nestjs/graphql';
import { getI18nContextFromRequest } from 'nestjs-i18n';

@Injectable()
export class JwtRefreshAuthGuard extends AuthGuard('jwt-refresh') {
  getRequest(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context);
    const req = ctx.getContext().req;
    const i18nContext = getI18nContextFromRequest(req);
    req.i18nContext = i18nContext;
    return ctx.getContext().req;
  }
}
