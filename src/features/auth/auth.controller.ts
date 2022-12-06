import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthenticationNotRequired } from './decorators/authentication-not-required';
import { GetCurrentUser } from './decorators/get-current-user.decorator';
import { CurrentUser } from './types/current-user.type';

@Controller('auth')
export class AuthController {
  @Get('google')
  @AuthenticationNotRequired()
  @UseGuards(AuthGuard('google'))
  async googleAuth(@Req() req) {
    console.log(
      '🚀 ~ file: auth.controller.ts ~ line 57 ~ AuthController ~ googleAuth ~ req',
      req.user,
    );
  }
  @Get('callback/google')
  @AuthenticationNotRequired()
  @UseGuards(AuthGuard('google'))
  async callbackGoogle(@GetCurrentUser() user: CurrentUser) {
    return {
      accessToken: user.authAccessToken,
      refreshToken: user.authRefreshToken,
    };
  }
}
