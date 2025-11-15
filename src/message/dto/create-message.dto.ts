import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsString,
  IsOptional,
  IsEnum,
} from 'class-validator';
import { AttachmentType } from '../entities/message.entity';

export class CreateMessageDto {
  @ApiProperty({
    description: 'The project ID associated with the message',
    example: 123,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  projectId?: number;

  @ApiProperty({
    description: 'The sender user ID',
    example: 1,
  })
  @IsNotEmpty()
  @IsNumber()
  senderId: number;

  @ApiProperty({
    description: 'The group ID associated with the message',
    example: 5,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  groupId?: number;

  @ApiProperty({
    description: 'The content of the message',
    example: 'Hello, this is a message',
    required: false,
  })
  @IsOptional()
  @IsString()
  content?: string;

  @ApiProperty({
    description: 'The type of attachment',
    enum: AttachmentType,
    example: AttachmentType.IMAGE,
    required: false,
  })
  @IsOptional()
  @IsEnum(AttachmentType)
  attachmentType?: AttachmentType;

  @ApiProperty({
    description: 'The attachment key',
    example: 'attachment-key-123',
    required: false,
  })
  @IsOptional()
  @IsString()
  attachmentKey?: string;
}
