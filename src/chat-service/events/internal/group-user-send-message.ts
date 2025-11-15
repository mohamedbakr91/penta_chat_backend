import { InternalEvent } from 'src/shared/interfaces/internal-event';

class UserSendMessageToGroupDTO {
  groupId: number;
  messageId: number;
  message: string;
  timestamp: Date;
  userId: number;
}

export class UserSendMessageToGroupEvent extends InternalEvent<UserSendMessageToGroupDTO> {
  constructor(protected readonly eventData: UserSendMessageToGroupDTO) {
    super(eventData);
  }

  get data() {
    return this.eventData;
  }
}
