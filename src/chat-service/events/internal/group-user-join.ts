import { InternalEvent } from 'src/shared/interfaces/internal-event';

class UserJoinToGroupDTO {
  groupId: number;
  timestamp: Date;
  userId: number;
  userName: string;
}

export class UserJoinToGroupEvent extends InternalEvent<UserJoinToGroupDTO> {
  constructor(protected readonly eventData: UserJoinToGroupDTO) {
    super(eventData);
  }

  get data() {
    return this.eventData;
  }
}
