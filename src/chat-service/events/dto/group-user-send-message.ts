import { AttachmentType } from 'src/message/entities/message.entity';
import { Events } from '../events.dto';

export class UserSendMessageToGroupDTO {
  static event = Events.SEND_MESSAGE;
  groupId: number;
  userId: number;
  messageId: number;
  content: string;
  attachmentKey: string;
  attachmentType: AttachmentType;
}
