export class WebsocketHelpers {
  static getUserConnectionRoom(userId: number): string {
    return `user:${userId}`;
  }

  static getGroupConnectionRoom(groupId: number): string {
    return `group:${groupId}`;
  }
}
