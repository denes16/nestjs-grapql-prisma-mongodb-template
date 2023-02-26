import {
  Controller,
  Get,
  Param,
  Redirect,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthenticationNotRequired } from './decorators/authentication-not-required';
import { GetCurrentUser } from './decorators/get-current-user.decorator';
import { GoogleRedirectAuthGuard } from './guards/google-redirect-auth.guard';
import { CurrentUser } from './types/current-user.type';
import { ConfigService } from '@nestjs/config';

@Controller('auth')
export class AuthController {
  constructor(private configService: ConfigService) {}
  @Get('google/:type')
  @AuthenticationNotRequired()
  @UseGuards(GoogleRedirectAuthGuard)
  async googleAuth(@Req() req: any, @Param('type') type: string) {
    return '';
  }
  @Get('callback/google/:type')
  @AuthenticationNotRequired()
  @UseGuards(AuthGuard('google'))
  @Redirect()
  async callbackGoogle(
    @GetCurrentUser() user: CurrentUser,
    @Param('type') type: string = 'web',
  ) {
    if (type === 'web')
      return {
        url:
          this.configService.get('GOOGLE_CALLBACK_WEB_URL') +
          '?accessToken=' +
          user.authAccessToken +
          '&refreshToken=' +
          user.authRefreshToken +
          '&userId=' +
          user.id,
      };
    return {
      accessToken: user.authAccessToken,
      refreshToken: user.authRefreshToken,
    };
  }
}
