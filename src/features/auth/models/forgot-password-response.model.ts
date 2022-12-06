import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class ForgotPasswordResponse {
  @Field(() => String, { nullable: true })
  email?: string;
}
