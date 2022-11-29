import { Field } from '@nestjs/graphql';
import { InputType } from '@nestjs/graphql';
import { AuthProvider } from './auth-provider.enum';
import { NestedIntFilter } from './nested-int-filter.input';
import { NestedEnumAuthProviderFilter } from './nested-enum-auth-provider-filter.input';

@InputType()
export class NestedEnumAuthProviderWithAggregatesFilter {

    @Field(() => AuthProvider, {nullable:true})
    equals?: keyof typeof AuthProvider;

    @Field(() => [AuthProvider], {nullable:true})
    in?: Array<keyof typeof AuthProvider>;

    @Field(() => [AuthProvider], {nullable:true})
    notIn?: Array<keyof typeof AuthProvider>;

    @Field(() => NestedEnumAuthProviderWithAggregatesFilter, {nullable:true})
    not?: NestedEnumAuthProviderWithAggregatesFilter;

    @Field(() => NestedIntFilter, {nullable:true})
    _count?: NestedIntFilter;

    @Field(() => NestedEnumAuthProviderFilter, {nullable:true})
    _min?: NestedEnumAuthProviderFilter;

    @Field(() => NestedEnumAuthProviderFilter, {nullable:true})
    _max?: NestedEnumAuthProviderFilter;
}
