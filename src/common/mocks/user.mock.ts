import { User } from '@prisma/client';
export const UserMock: User = {
  id: '1',
  email: 'email@email.com',
  modelName: 'User',
  firstName: 'firstName',
  lastName: 'lastName',
  password: '$2b$10$',
  language: 'en',
  createdAt: new Date(),
  updatedAt: new Date(),
  isActive: true,
} as any;
