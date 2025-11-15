import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { WebsocketService } from 'src/webSocket/webSocket.service';
import { UserSendMessageToGroupEvent } from './events/internal/group-user-send-message';
import { WebsocketHelpers } from 'src/webSocket/helpers/websocket-helpers';
import { UserSendMessageToGroupDTO } from './events/dto/group-user-send-message';
import { UserJoinToGroupEvent } from './events/internal/group-user-join';

@Injectable()
export class InternalEventListener {
  private readonly logger = new Logger(InternalEventListener.name);

  constructor(private wsService: WebsocketService) {}

  @OnEvent(UserSendMessageToGroupEvent.name)
  async handleUserSendMessageToGroup(payload: UserSendMessageToGroupEvent) {
    this.logger.log(`Received Event From UserSendMessageToGroupEvent`);

    this.wsService.emitEventToRoom<UserSendMessageToGroupEvent>({
      event: UserSendMessageToGroupEvent.name,
      room: WebsocketHelpers.getGroupConnectionRoom(payload.data.groupId),
      data: payload,
    });
  }

  @OnEvent(UserJoinToGroupEvent.name)
  async handleUserJoinToGroup(payload: UserJoinToGroupEvent) {
    const { groupId, userId, userName, timestamp } = payload.data;

    this.logger.log(
      `User ${userName} (ID: ${userId}) joined group ${groupId} at ${timestamp}`,
    );

    this.wsService.emitEventToRoom<UserJoinToGroupEvent>({
      event: UserJoinToGroupEvent.name,
      room: WebsocketHelpers.getGroupConnectionRoom(groupId),
      data: payload,
    });
  }
}
