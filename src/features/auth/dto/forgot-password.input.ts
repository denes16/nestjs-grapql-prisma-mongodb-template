import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsOptional } from 'class-validator';

@InputType()
export class ForgotPasswordInput {
  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsEmail()
  email?: string;
}
