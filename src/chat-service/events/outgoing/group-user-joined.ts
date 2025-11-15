import { AttachmentType } from 'src/message/entities/message.entity';
import { UserDTO } from 'src/user/dto/user.dto';

export class UserJoinedGroupOutgoingEvent {
  static event = 'group:user:joined';
  groupId: number;
  messageId: number;
  content: string;
  attachmentKey: string;
  attachmentType: AttachmentType;
}
