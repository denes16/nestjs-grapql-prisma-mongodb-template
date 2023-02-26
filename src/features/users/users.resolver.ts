import { Resolver, Query, Mutation, Args, Int, ID } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { User } from '../../@generated/user/user.model';
import { GetCurrentUser } from '../auth/decorators/get-current-user.decorator';
import { CurrentUser } from '../auth/types/current-user.type';

@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  // @Mutation(() => User)
  // createUser(@Args('createUserInput') createUserInput: CreateUserInput) {
  //   return this.usersService.create(createUserInput);
  // }

  // @Query(() => [User], { name: 'users' })
  // findAll() {
  //   return this.usersService.findAll();
  // }

  @Query(() => User, { name: 'me' })
  me(@GetCurrentUser() currentUser: CurrentUser) {
    return this.usersService.findOne(currentUser.id, currentUser);
  }
  @Query(() => User, { name: 'user' })
  findOne(
    @Args('id', { type: () => ID }) id: string,
    @GetCurrentUser() currentUser: CurrentUser,
  ) {
    return this.usersService.findOne(id, currentUser);
  }

  @Mutation(() => User)
  updateUser(
    @Args('updateUserInput') updateUserInput: UpdateUserInput,
    @GetCurrentUser() currentUser: CurrentUser,
  ) {
    return this.usersService.update(updateUserInput, currentUser);
  }

  // @Mutation(() => User)
  // removeUser(@Args('id', { type: () => Int }) id: number) {
  //   return this.usersService.remove(id);
  // }
}
