import { Field } from '@nestjs/graphql';
import { InputType } from '@nestjs/graphql';
import { AuthProvider } from './auth-provider.enum';

@InputType()
export class EnumAuthProviderFieldUpdateOperationsInput {

    @Field(() => AuthProvider, {nullable:true})
    set?: keyof typeof AuthProvider;
}
