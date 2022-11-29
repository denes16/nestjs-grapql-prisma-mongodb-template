import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsString } from 'class-validator';

@InputType()
export class ForgotPasswordTokenInput {
  @Field(() => String)
  @IsString()
  token: string;
}
