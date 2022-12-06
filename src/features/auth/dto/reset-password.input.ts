import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsString } from 'class-validator';

@InputType()
export class ResetPasswordInput {
  @Field(() => String)
  @IsString()
  token: string;

  @Field(() => String)
  @IsString()
  password: string;
}
