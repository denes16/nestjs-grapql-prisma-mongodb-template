import { registerEnumType } from '@nestjs/graphql';

export enum UserScalarFieldEnum {
    id = "id",
    firstName = "firstName",
    lastName = "lastName",
    email = "email",
    language = "language",
    password = "password",
    createdAt = "createdAt",
    updatedAt = "updatedAt",
    isActive = "isActive",
    modelName = "modelName"
}


registerEnumType(UserScalarFieldEnum, { name: 'UserScalarFieldEnum', description: undefined })
