import { Module } from '@nestjs/common';
import { ChatServiceController } from './chat-service.controller';
import { ChatService } from './chat-service.service';
import { GroupMembersModule } from 'src/group-members/group-members.module';
import { GroupModule } from 'src/group/group.module';
import { ProjectModule } from 'src/project/project.module';
import { UserModule } from 'src/user/user.module';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  imports: [
    GroupModule,
    GroupMembersModule,
    ProjectModule,
    UserModule,
    DatabaseModule,
  ],
  controllers: [ChatServiceController],
  providers: [ChatService],
})
export class ChatServiceModule {}
