import { Field } from '@nestjs/graphql';
import { ObjectType } from '@nestjs/graphql';
import { HideField } from '@nestjs/graphql';
import { AuthProvider } from '../prisma/auth-provider.enum';
import { UserCountAggregate } from './user-count-aggregate.output';
import { UserMinAggregate } from './user-min-aggregate.output';
import { UserMaxAggregate } from './user-max-aggregate.output';

@ObjectType()
export class UserGroupBy {

    @Field(() => String, {nullable:false})
    id!: string;

    @Field(() => String, {nullable:false})
    firstName!: string;

    @Field(() => String, {nullable:false})
    lastName!: string;

    @Field(() => String, {nullable:false})
    email!: string;

    @Field(() => String, {nullable:false})
    language!: string;

    @HideField()
    password?: string;

    @HideField()
    resetPasswordToken?: string;

    @HideField()
    resetPasswordTokenExpires?: Date | string;

    @Field(() => Date, {nullable:false})
    createdAt!: Date | string;

    @Field(() => Date, {nullable:false})
    updatedAt!: Date | string;

    @Field(() => Boolean, {nullable:false})
    isActive!: boolean;

    @HideField()
    modelName!: string;

    @HideField()
    authProvider!: keyof typeof AuthProvider;

    @HideField()
    authProviderId?: string;

    @Field(() => UserCountAggregate, {nullable:true})
    _count?: UserCountAggregate;

    @Field(() => UserMinAggregate, {nullable:true})
    _min?: UserMinAggregate;

    @Field(() => UserMaxAggregate, {nullable:true})
    _max?: UserMaxAggregate;
}
