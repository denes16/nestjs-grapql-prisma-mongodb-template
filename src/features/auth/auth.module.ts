import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';
import { JwtAccessStrategy } from './strategies/jwt-access.strategy';
import { CaslAbilityFactoryService } from './casl-ability-factory.service';
import { JwtRefreshStrategy } from './strategies/jwt-refresh.strategy';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthController } from './auth.controller';
import { GoogleAccessStrategy } from './strategies/google-access.strategy';
import { GoogleAccessTokenStrategy } from './strategies/google-access-token.strategy';

@Module({
  providers: [
    AuthResolver,
    AuthService,
    JwtAccessStrategy,
    JwtRefreshStrategy,
    GoogleAccessTokenStrategy,
    GoogleAccessStrategy,
    CaslAbilityFactoryService,
    ConfigService,
  ],
  imports: [JwtModule.register({})],
  controllers: [AuthController],
})
export class AuthModule {}
