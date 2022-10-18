import { InputType, Field, ID } from '@nestjs/graphql';

@InputType()
export class UpdateUserInput {
  @Field(() => ID)
  id: string;
  @Field(() => String)
  firtsName: string;
  @Field(() => String)
  lastName: string;
}
