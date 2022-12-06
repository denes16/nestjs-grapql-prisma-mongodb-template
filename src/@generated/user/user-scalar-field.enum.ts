import { registerEnumType } from '@nestjs/graphql';

export enum UserScalarFieldEnum {
    id = "id",
    firstName = "firstName",
    lastName = "lastName",
    email = "email",
    language = "language",
    password = "password",
    resetPasswordToken = "resetPasswordToken",
    resetPasswordTokenExpires = "resetPasswordTokenExpires",
    createdAt = "createdAt",
    updatedAt = "updatedAt",
    isActive = "isActive",
    modelName = "modelName",
    authProvider = "authProvider",
    authProviderId = "authProviderId"
}


registerEnumType(UserScalarFieldEnum, { name: 'UserScalarFieldEnum', description: undefined })
