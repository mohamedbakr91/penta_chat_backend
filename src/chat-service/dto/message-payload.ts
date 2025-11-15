import { AttachmentType } from 'src/message/entities/message.entity';

export class MessagePayload {
  groupId: number;
  messageId: number;
  content: string;
  attachmentKey: string;
  attachmentType: AttachmentType;
}
