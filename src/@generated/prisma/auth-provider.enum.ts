import { registerEnumType } from '@nestjs/graphql';

export enum AuthProvider {
    LOCAL = "LOCAL",
    GOOGLE = "GOOGLE"
}


registerEnumType(AuthProvider, { name: 'AuthProvider', description: undefined })
