import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { CurrentUser } from '../auth/types/current-user.type';
import { PrismaService } from '../../core/services/prisma/prisma.service';
import { AbilityAction } from '../auth/casl-ability-factory.service';
import { NeedsPermission } from '../auth/decorators/needs-permissions.decorator';

@Injectable()
export class UsersService {
  constructor(private prismaService: PrismaService) {}
  create(createUserInput: CreateUserInput) {
    return 'This action adds a new user';
  }

  findAll() {
    return `This action returns all users`;
  }

  @NeedsPermission(AbilityAction.Read, 'User')
  async findOne(id: string, currentUser: CurrentUser) {
    const user = await this.prismaService.user.findUnique({
      where: {
        id,
      },
    });
    if (!user) {
      throw new NotFoundException();
    }
    if (!currentUser.ability.can(AbilityAction.Read, user)) {
      throw new ForbiddenException();
    }
    return user;
  }

  async update(updateUserInput: UpdateUserInput, currentUser: CurrentUser) {
    const user = await this.findOne(updateUserInput.id, currentUser);
    if (!user) {
      throw new NotFoundException('errors.userNotFound');
    }
    if (!currentUser) {
      throw new ForbiddenException();
    }
    return await this.prismaService.user.update({
      where: {
        id: user.id,
      },
      data: {
        ...updateUserInput,
      },
    });
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
