import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { Message } from './entities/message.entity';
import { MessageController } from './message.controller';
import { MessageService } from './message.service';
import { MessageRepository } from './repositories/message.repository';

@Module({
  imports: [DatabaseModule],
  controllers: [MessageController],
  providers: [
    { useValue: Message, provide: 'MESSAGE_MODEL' },
    MessageRepository,
    MessageService,
  ],
  exports: [MessageService],
})
export class MessageModule {}
