import { AuthGuard } from '@nestjs/passport';
import { ExecutionContext, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
@Injectable()
export class GoogleRedirectAuthGuard extends AuthGuard('google') {
  constructor(private configService: ConfigService) {
    super();
  }
  getAuthenticateOptions(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest();
    let type = req.params.type ?? 'web';
    if (!['web', 'mobile'].includes(type)) type = 'web';
    const redirectUrl = this.configService.get('GOOGLE_CALLBACK_URL');
    return {
      callbackURL: redirectUrl,
    };
  }
}
