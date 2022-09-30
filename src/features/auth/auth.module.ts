import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';
import { JwtAccessStrategy } from './strategies/jwt-access.strategy';
import { CaslAbilityFactoryService } from './casl-ability-factory.service';
import { JwtRefreshStrategy } from './strategies/jwt-refresh.strategy';

@Module({
  providers: [
    AuthResolver,
    AuthService,
    JwtAccessStrategy,
    JwtRefreshStrategy,
    CaslAbilityFactoryService,
  ],
  imports: [JwtModule.register({})],
})
export class AuthModule {}
