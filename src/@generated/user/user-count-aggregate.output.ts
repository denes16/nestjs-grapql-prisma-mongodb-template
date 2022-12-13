import { Field } from '@nestjs/graphql';
import { ObjectType } from '@nestjs/graphql';
import { Int } from '@nestjs/graphql';
import { HideField } from '@nestjs/graphql';

@ObjectType()
export class UserCountAggregate {

    @Field(() => Int, {nullable:false})
    id!: number;

    @Field(() => Int, {nullable:false})
    firstName!: number;

    @Field(() => Int, {nullable:false})
    lastName!: number;

    @Field(() => Int, {nullable:false})
    email!: number;

    @Field(() => Int, {nullable:false})
    language!: number;

    @HideField()
    password!: number;

    @HideField()
    resetPasswordToken!: number;

    @HideField()
    resetPasswordTokenExpires!: number;

    @Field(() => Int, {nullable:false})
    createdAt!: number;

    @Field(() => Int, {nullable:false})
    updatedAt!: number;

    @Field(() => Int, {nullable:false})
    isActive!: number;

    @HideField()
    modelName!: number;

    @HideField()
    authProvider!: number;

    @HideField()
    authProviderId!: number;

    @Field(() => Int, {nullable:false})
    _all!: number;
}
