import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { DatabaseModule } from './database/database.module';
import { SharedModule } from './shared/module/shared.module';
import { FilesModule } from './files/files.module';
import { HealthModule } from './config/health/health.module';
import { UserModule } from './user/user.module';
import { EncryptionUtils } from './shared/helpers/encryption';
import { APP_FILTER } from '@nestjs/core';
import { AllExceptionsFilter } from './shared/interceptors/all-exceptions-filter';
import { HttpModule } from '@nestjs/axios';
import { redisStore } from 'cache-manager-redis-store';
import { GroupModule } from './group/group.module';
import { ProjectModule } from './project/project.module';
import { ChatServiceModule } from './chat-service/chat-service.module';
import configuration from './config/configuration';
import { ClsModule } from 'nestjs-cls';
import { MessageModule } from './message/message.module';

@Module({
  imports: [
    CacheModule.registerAsync({
      isGlobal: true,
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        store: await redisStore({
          host: config.get('redisHost') || '127.0.0.1',
          port: config.get('redisPort') || 6379,
          username: config.get('redisUserName'),
          password: config.get('redisPassword'),
          db: config.get('redisDB') || 0,
        }),
        // ttl: 60 * 60, // default TTL (اختياري)
      }),
    }),
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
    }),

    ClsModule.forRoot({
      middleware: {
        mount: true,
      },
      global: true,
    }),
    EventEmitterModule.forRoot(),
    HttpModule,
    DatabaseModule,
    SharedModule,
    FilesModule,
    HealthModule,
    UserModule,
    GroupModule,
    ChatServiceModule,
    ProjectModule,
    MessageModule,
  ],
  controllers: [],
  providers: [
    EncryptionUtils,
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
  ],
})
export class AppModule {}
