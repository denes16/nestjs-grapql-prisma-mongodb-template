import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { CurrentUser } from '../types/current-user.type';
import { GqlExecutionContext } from '@nestjs/graphql';
export const GetCurrentUser = createParamDecorator(
  (_, ctx: ExecutionContext): CurrentUser => {
    const context = GqlExecutionContext.create(ctx);
    const req = context.getContext().req;
    return req.user;
  },
);
