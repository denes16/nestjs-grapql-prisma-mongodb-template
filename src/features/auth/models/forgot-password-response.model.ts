import { Field, ObjectType } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import { User } from '../../../@generated/user/user.model';

@ObjectType()
export class ForgotPasswordResponse {
  @Field(() => User, { nullable: true })
  @Type(() => User)
  user?: User;
}
