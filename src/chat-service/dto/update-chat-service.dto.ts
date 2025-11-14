import { PartialType } from '@nestjs/swagger';
import { CreateChatServiceDto } from './create-chat-service.dto';

export class UpdateChatServiceDto extends PartialType(CreateChatServiceDto) {}
