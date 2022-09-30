import { Field, InputType, ObjectType } from '@nestjs/graphql';

import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';
@InputType()
export class SignUpInput {
  @Field(() => String)
  @IsNotEmpty()
  @MinLength(4)
  firstName: string;
  @Field(() => String)
  @IsNotEmpty()
  @MinLength(4)
  lastName: string;
  @Field(() => String)
  @IsEmail()
  email: string;
  @Field(() => String)
  @IsNotEmpty()
  @MinLength(6)
  password: string;
}
