import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { WebsocketService } from 'src/webSocket/webSocket.service';
import { UserSendMessageToGroupEvent } from './events/internal/group-user-send-message';
import { WebsocketHelpers } from 'src/webSocket/helpers/websocket-helpers';
import { UserJoinToGroupEvent } from './events/internal/group-user-join';
import { UserJoinedGroupOutgoingEvent } from './events/outgoing/group-user-joined';
import { UserGroupMessageSentOutgoingEvent } from './events/outgoing/group-message-sent';

@Injectable()
export class InternalEventListener {
  private readonly logger = new Logger(InternalEventListener.name);

  constructor(private wsService: WebsocketService) {}

  @OnEvent(UserSendMessageToGroupEvent.name)
  async handleUserSendMessageToGroup(payload: UserSendMessageToGroupEvent) {
    console.log(
      '🚀 ~ InternalEventListener ~ handleUserSendMessageToGroup ~ payload:',
      payload,
    );
    this.logger.log(`Received Event From UserSendMessageToGroupEvent`);

    this.wsService.emitEventToRoom<UserGroupMessageSentOutgoingEvent>({
      event: UserGroupMessageSentOutgoingEvent.event,
      room: WebsocketHelpers.getGroupConnectionRoom(payload.data.groupId),
      data: payload.data,
    });
  }

  @OnEvent(UserJoinToGroupEvent.name)
  async handleUserJoinToGroup(payload: UserJoinToGroupEvent) {
    // const { groupId, userId, userName, timestamp } = payload.data;

    this.logger.log(
      `User ${payload.data.userId} (ID: ${payload.data.userId}) joined group ${payload.data.groupId} at ${payload.data.timestamp}`,
    );

    this.wsService.emitEventToRoom<UserJoinedGroupOutgoingEvent>({
      event: UserJoinedGroupOutgoingEvent.event,
      room: WebsocketHelpers.getGroupConnectionRoom(payload.data.groupId),
      data: payload.data,
    });
  }
}

// @OnEvent(UserJoinedTopicEvent.name)
// async handleUserJoinedTopic(payload: UserJoinedTopicEvent) {
//   this.logger.log(`Received Event From UserJoinedTopicEvent`);

//   this.wsService.emitEventToRoom<UserJoinedTopicOutgoingEvent>({
//     event: UserJoinedTopicOutgoingEvent.event,

//     room: WebsocketHelpers.getTopicConnectionRoom(payload.data.topicId),

//     data: payload.data,
//   });
// }
