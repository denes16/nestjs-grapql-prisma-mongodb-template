import { Field, InputType } from '@nestjs/graphql';
import { IsEmail } from 'class-validator';

@InputType()
export class ResetPasswordInput {
  @Field(() => String)
  token: string;

  @Field(() => String)
  password: string;
}
