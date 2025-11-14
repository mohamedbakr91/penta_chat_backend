import { ApiProperty } from '@nestjs/swagger';
import { AttachmentType } from '../entities/message.entity';

export class MessageDTO {
  @ApiProperty({
    description: 'The unique identifier of the message',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'The project ID associated with the message',
    example: 123,
    required: false,
  })
  projectId?: number;

  @ApiProperty({
    description: 'The sender user ID',
    example: 1,
  })
  senderId: number;

  @ApiProperty({
    description: 'The recipient user ID',
    example: 2,
    required: false,
  })
  recipientId?: number;

  @ApiProperty({
    description: 'The group ID associated with the message',
    example: 5,
    required: false,
  })
  groupId?: number;

  @ApiProperty({
    description: 'The content of the message',
    example: 'Hello, this is a message',
    required: false,
  })
  content?: string;

  @ApiProperty({
    description: 'The type of attachment',
    enum: AttachmentType,
    example: AttachmentType.IMAGE,
    required: false,
  })
  attachmentType?: AttachmentType;

  @ApiProperty({
    description: 'The attachment key',
    example: 'attachment-key-123',
    required: false,
  })
  attachmentKey?: string;

  @ApiProperty({
    description: 'The date and time when the message was created',
    example: '2024-12-16T12:34:56Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'The date and time when the message was last updated',
    example: '2024-12-17T15:30:00Z',
  })
  updatedAt: Date;
}
