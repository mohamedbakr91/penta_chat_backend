import { Module } from '@nestjs/common';
import { ChatServiceController } from './chat-service.controller';
import { ChatService } from './chat-service.service';
import { GroupModule } from 'src/group/group.module';
import { ProjectModule } from 'src/project/project.module';
import { UserModule } from 'src/user/user.module';
import { DatabaseModule } from 'src/database/database.module';
import { RedisIoAdapter } from 'src/shared/adapters/redis-io.adapter';
import { ChatGateway } from './chat.getway';
import { AuthModule } from 'src/auth/auth.module';
import { MessageModule } from 'src/message/message.module';
import { WebsocketService } from 'src/webSocket/webSocket.service';
import { InternalEventListener } from './chat.lisitenere';

@Module({
  imports: [
    GroupModule,
    ProjectModule,
    UserModule,
    DatabaseModule,
    AuthModule,
    MessageModule,
  ],
  controllers: [ChatServiceController],
  providers: [
    ChatGateway,
    ChatService,
    WebsocketService,
    InternalEventListener,
  ],
})
export class ChatServiceModule {}
