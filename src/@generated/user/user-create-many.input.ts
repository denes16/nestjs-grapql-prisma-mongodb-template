import { Field } from '@nestjs/graphql';
import { InputType } from '@nestjs/graphql';
import { HideField } from '@nestjs/graphql';
import { AuthProvider } from '../prisma/auth-provider.enum';

@InputType()
export class UserCreateManyInput {

    @Field(() => String, {nullable:true})
    id?: string;

    @Field(() => String, {nullable:false})
    firstName!: string;

    @Field(() => String, {nullable:false})
    lastName!: string;

    @Field(() => String, {nullable:false})
    email!: string;

    @Field(() => String, {nullable:true})
    language?: string;

    @Field(() => String, {nullable:true})
    password?: string;

    @Field(() => String, {nullable:true})
    resetPasswordToken?: string;

    @Field(() => Date, {nullable:true})
    resetPasswordTokenExpires?: Date | string;

    @Field(() => Date, {nullable:true})
    createdAt?: Date | string;

    @Field(() => Date, {nullable:true})
    updatedAt?: Date | string;

    @Field(() => Boolean, {nullable:true})
    isActive?: boolean;

    @HideField()
    modelName?: string;

    @HideField()
    authProvider?: keyof typeof AuthProvider;

    @HideField()
    authProviderId?: string;
}
