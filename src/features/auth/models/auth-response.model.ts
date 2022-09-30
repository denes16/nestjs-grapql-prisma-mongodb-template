import { Field, ObjectType } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import { User } from '../../../@generated/user/user.model';

@ObjectType()
export class AuthResponse {
  @Field(() => String)
  accessToken: string;

  @Field(() => String, { nullable: true })
  refreshToken?: string;

  @Field(() => User)
  @Type(() => User)
  user: User;
}
