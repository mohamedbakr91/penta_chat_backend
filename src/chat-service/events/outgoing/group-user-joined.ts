export class UserJoinedGroupOutgoingEvent {
  static event = 'group:user:joined';
  groupId: number;
  timestamp: Date;
  userId: number;
  userName: string;
}
