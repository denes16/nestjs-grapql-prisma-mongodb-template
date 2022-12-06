import { Field } from '@nestjs/graphql';
import { InputType } from '@nestjs/graphql';
import { AuthProvider } from './auth-provider.enum';
import { NestedEnumAuthProviderFilter } from './nested-enum-auth-provider-filter.input';

@InputType()
export class EnumAuthProviderFilter {

    @Field(() => AuthProvider, {nullable:true})
    equals?: keyof typeof AuthProvider;

    @Field(() => [AuthProvider], {nullable:true})
    in?: Array<keyof typeof AuthProvider>;

    @Field(() => [AuthProvider], {nullable:true})
    notIn?: Array<keyof typeof AuthProvider>;

    @Field(() => NestedEnumAuthProviderFilter, {nullable:true})
    not?: NestedEnumAuthProviderFilter;
}
