import { Field } from '@nestjs/graphql';
import { ObjectType } from '@nestjs/graphql';
import { ID } from '@nestjs/graphql';
import { HideField } from '@nestjs/graphql';
import { AuthProvider } from '../prisma/auth-provider.enum';

@ObjectType()
export class User {

    @Field(() => ID, {nullable:false})
    id!: string;

    @Field(() => String, {nullable:false})
    firstName!: string;

    @Field(() => String, {nullable:false})
    lastName!: string;

    @Field(() => String, {nullable:false})
    email!: string;

    @Field(() => String, {nullable:false,defaultValue:'en'})
    language!: string;

    @HideField()
    password!: string | null;

    @HideField()
    resetPasswordToken!: string | null;

    @HideField()
    resetPasswordTokenExpires!: Date | null;

    @Field(() => Date, {nullable:false})
    createdAt!: Date;

    @Field(() => Date, {nullable:false})
    updatedAt!: Date;

    @Field(() => Boolean, {nullable:false,defaultValue:true})
    isActive!: boolean;

    @HideField()
    modelName!: string;

    @HideField()
    authProvider!: keyof typeof AuthProvider;

    @HideField()
    authProviderId!: string | null;
}
