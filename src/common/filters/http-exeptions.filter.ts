import { getI18nContextFromArgumentsHost } from 'nestjs-i18n';
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { GqlContextType } from '@nestjs/graphql';

@Catch(HttpException)
export class AllExceptionsFilter implements ExceptionFilter {
  async catch(exception: HttpException, host: ArgumentsHost) {
    const isGraphql = host.getType<GqlContextType>() === 'graphql';

    let i18n = getI18nContextFromArgumentsHost(host);
    if (!i18n.service && isGraphql) {
      const request = host.getArgByIndex(2).req;
      i18n = (request as any).i18nContext;
    }
    const statusCode = exception.getStatus();
    const response = host.switchToHttp().getResponse<Response>();
    const message = exception.getResponse() as {
      key: string;
      message: string;
      args: Record<string, any>;
    };
    if (typeof (message.key || message.message) === 'string') {
      const translatedMessage = await i18n.t(message.key || message.message, {
        args: message.args,
      });
      if (isGraphql) {
        exception.message = translatedMessage;
        throw exception;
      }
      response
        .status(statusCode)
        .json({ statusCode, message: translatedMessage });
    } else {
      if (isGraphql) {
        throw new HttpException(
          { message: message.message },
          exception.getStatus(),
        );
        // throw exception.constructor(exception.message);
      }
      response.status(statusCode).json(message);
    }
  }
}
