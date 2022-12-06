import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './features/users/users.module';
import { CoreModule } from './core/core.module';
import { AuthModule } from './features/auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ApolloServerPluginLandingPageLocalDefault } from 'apollo-server-core';
import { AcceptLanguageResolver, I18nModule, I18nService } from 'nestjs-i18n';
import { PoliciesGuard } from './features/auth/guards/policies.guard';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { AllExceptionsFilter } from './common/filters/http-exeptions.filter';
import { JwtAccessAuthGuard } from './features/auth/guards/jwt-access-auth.guard';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';

@Module({
  imports: [
    CoreModule,
    UsersModule,
    AuthModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      playground: false,
      plugins:
        process.env.NODE_ENV === 'development'
          ? [ApolloServerPluginLandingPageLocalDefault()]
          : [],
      introspection: process.env.NODE_ENV === 'development',
    }),
    I18nModule.forRoot({
      fallbackLanguage: 'en',
      loaderOptions: {
        path: join(__dirname, '/i18n/'),
        watch: true,
      },
      resolvers: [AcceptLanguageResolver],
      disableMiddleware: false,
    }),
    ConfigModule.forRoot(),
    MailerModule.forRootAsync({
      inject: [ConfigService, I18nService],
      imports: [ConfigModule],
      useFactory: async (config: ConfigService, i18n: I18nService) => ({
        transport: {
          host: config.get('MAIL_HOST'),
          port: config.get('MAIL_PORT'),
          auth: {
            user: config.get('MAIL_AUTH_USER'),
            pass: config.get('MAIL_AUTH_PASS'),
          },
        },
        defaults: {
          from: '"No Reply" <' + config.get('MAIL_FROM') + '>',
        },
        preview: true,
        // * disable sending emails in development/test env
        options: {
          send: false,
        },

        template: {
          dir: join(__dirname, 'templates/mailers'),
          adapter: new HandlebarsAdapter({ t: i18n.hbsHelper }),
          options: {
            strict: false,
          },
        },
      }),
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    PoliciesGuard,
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
    {
      provide: APP_GUARD,
      useClass: JwtAccessAuthGuard,
    },
  ],
})
export class AppModule {}
