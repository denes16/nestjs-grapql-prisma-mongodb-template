import { Global, Module } from '@nestjs/common';
import { PrismaService } from './services/prisma/prisma.service';
@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class CoreModule {}
