export class UserGroupMessageSentOutgoingEvent {
  static event = 'group:message:sent';
  groupId: number;
  messageId: number;
  message: string;
  timestamp: Date;
  userId: number;
}
