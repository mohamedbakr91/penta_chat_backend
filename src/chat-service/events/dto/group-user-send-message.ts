import {
  AttachmentType,
  MessageType,
} from 'src/message/entities/message.entity';
import { Events } from '../events.dto';

export class UserSendMessageToGroupDTO {
  static event = Events.SEND_MESSAGE;
  groupId: number;
  messageType: MessageType;
  // messageId: number;
  content: string;
  attachmentKey?: string;
  attachmentType?: AttachmentType;
}
