import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsString } from 'class-validator';

@InputType()
export class ResetPasswordTokenInput {
  @Field(() => String)
  @IsString()
  token: string;
}
