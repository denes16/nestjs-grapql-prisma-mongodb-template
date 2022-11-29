import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { AuthResponse } from './models/auth-response.model';
import { SignUpInput } from './dto/sign-up.input';
import { AuthService } from './auth.service';
import { SignInInput } from './dto/sign-in.input';
import { AuthenticationNotRequired } from './decorators/authentication-not-required';
import { Param, UseGuards } from '@nestjs/common';
import { JwtRefreshAuthGuard } from './guards/jwt-refresh-auth.guard';
import { GetCurrentUser } from './decorators/get-current-user.decorator';
import { CurrentUser } from './types/current-user.type';
import { ForgotPasswordInput } from './dto/forgot-password.input';
import { ForgotPasswordResponse } from './models/forgot-password-response.model';
import { ForgotPasswordTokenInput } from './dto/forgot-password-token.input';
import { ResetPasswordInput } from './dto/reset-password.input';

@Resolver()
export class AuthResolver {
  constructor(private authService: AuthService) {}
  @AuthenticationNotRequired()
  @Mutation(() => AuthResponse)
  async signUp(@Args('signUpInput') signUpInput: SignUpInput) {
    return this.authService.signUp(signUpInput);
  }
  @AuthenticationNotRequired()
  @Mutation(() => AuthResponse)
  async signIn(@Args('signInInput') signInInput: SignInInput) {
    return this.authService.signIn(signInInput);
  }
  @AuthenticationNotRequired()
  @Mutation(() => AuthResponse)
  @UseGuards(JwtRefreshAuthGuard)
  async refreshAccessToken(@GetCurrentUser() currentUser: CurrentUser) {
    return this.authService.refreshAccessToken(currentUser);
  }
  @AuthenticationNotRequired()
  @Mutation(() => ForgotPasswordResponse)
  async forgotPassword(
    @Args('forgotPasswordInput') forgotPasswordInput: ForgotPasswordInput,
  ) {
    return this.authService.forgotPassword(forgotPasswordInput);
  }

  @AuthenticationNotRequired()
  @Mutation(() => ForgotPasswordResponse)
  async forgotPasswordToken(
    @Args('forgotPasswordTokenInput')
    forgotPasswordTokenInput: ForgotPasswordTokenInput,
  ) {
    return this.authService.forgotPasswordToken(forgotPasswordTokenInput);
  }

  @AuthenticationNotRequired()
  @Mutation(() => Boolean)
  async resetPassword(
    @Args('resetPasswordInput') resetPasswordInput: ResetPasswordInput,
  ) {
    return this.authService.resetPassword(resetPasswordInput);
  }
}
