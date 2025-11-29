import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  WebSocketServer,
  OnGatewayInit,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { AuthHelper } from 'src/auth/auth-helper.service';
import { GroupMembersService } from 'src/group/group-members.service';
import { WebsocketService } from 'src/webSocket/webSocket.service';
import { MessageService } from 'src/message/message.service';
import { Events } from './events/events.dto';
import { WebsocketHelpers } from 'src/webSocket/helpers/websocket-helpers';
import { joinedGroupDto } from './dto/join-group.dto';
import { RedisIoAdapter } from 'src/shared/adapters/redis-io.adapter';
import { UserSendMessageToGroupDTO } from './events/dto/group-user-send-message';
import { UserSendMessageToGroupEvent } from './events/internal/group-user-send-message';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { UserJoinToGroupEvent } from './events/internal/group-user-join';

@WebSocketGateway()
@Injectable()
export class ChatGateway implements OnGatewayInit {
  @WebSocketServer()
  server: Server;
  private readonly logger = new Logger(ChatGateway.name);

  constructor(
    private readonly eventEmitter: EventEmitter2,
    private readonly authHelper: AuthHelper,
    private readonly messageService: MessageService,
    private readonly websocketService: WebsocketService,
    private readonly groupMembersService: GroupMembersService,
  ) {}

  afterInit() {
    this.websocketService.setServer(this.server);
    this.logger.log('ChatGateway initialized');
  }

  // -----------------------------
  // 1️⃣ Handle User Connection
  // -----------------------------
  // private async handleUserConnection(userId: number) {
  //   const redisClient = RedisIoAdapter.getClientStatic();

  //   // Online status
  //   await redisClient.set(`user:${userId}:online`, '1');
  //   await redisClient.expire(`user:${userId}:online`, 30); // TTL 30s

  //   // Broadcast to all that user is online
  //   this.server.emit('userOnline', { userId });
  // }
  private async handleUserConnection(userId: number) {
    try {
      const redisClient = RedisIoAdapter.getClientStatic();
      await redisClient.set(`user:${userId}:online`, '1');
      await redisClient.expire(`user:${userId}:online`, 30);
      this.server.emit('userOnline', { userId });
    } catch (err) {
      this.logger.error('Redis error', err);
    }
  }

  // -----------------------------
  // 2️⃣ Handle User Disconnection
  // -----------------------------
  private async handleUserDisconnection(userId: number) {
    const redisClient = RedisIoAdapter.getClientStatic();

    await redisClient.del(`user:${userId}:online`);
    await redisClient.set(`user:${userId}:lastSeen`, Date.now());

    // Broadcast offline event
    this.server.emit('userOffline', { userId });
  }

  async handleConnection(socket: Socket, ...args: any[]): Promise<void> {
    try {
      const token =
        socket.handshake.auth.token || socket.handshake.headers.authorization;
      // Check if token exists
      if (!token) {
        throw new UnauthorizedException('Missing authorization token');
      }

      const user = await this.authHelper.verifyAuthJWTToken(token);

      socket.data = user;

      // this.websocketService.socketJoinRoom({
      //   socket: socket,
      //   room: WebsocketHelpers.getUserConnectionRoom(user.userId),
      // });
      await this.handleUserConnection(user.userId);

      const groups = await this.groupMembersService.findGroupsByUserId(
        user.userId,
      );

      groups.forEach((group) => {
        console.log(
          '🚀 ~ ChatGateway ~ handleConnection ~ group:',
          group.groupId,
        );
        socket.join(WebsocketHelpers.getGroupConnectionRoom(group.groupId));
      });
    } catch (error) {
      console.error(error);
      socket.disconnect();
    }
  }

  async handleDisconnect(socket: Socket) {
    const userId = socket.data?.userId;
    if (userId) {
      await this.handleUserDisconnection(userId);
      console.log(`User ${userId} disconnected`);
    }
  }

  @SubscribeMessage(Events.HEARTBEAT)
  async handleHeartbeat(@ConnectedSocket() socket: Socket) {
    const userId = socket.data?.userId;
    if (!userId) return;
    const redisClient = RedisIoAdapter.getClientStatic();
    await redisClient.set(`user:${userId}:online`, '1');
    await redisClient.expire(`user:${userId}:online`, 30); // refresh TTL

    await this.handleUserConnection(userId);
  }

  @SubscribeMessage(Events.JOIN_GROUP)
  async handleJoinGroup(
    @MessageBody() data: joinedGroupDto,
    @ConnectedSocket() client: Socket,
  ) {
    try {
      const { groupId } = data;
      const { projectId, userName, userId } = client.data;
      console.log('userId:', userId, 'groupId:', groupId);

      const userInGroup = await this.groupMembersService.userInGroup(
        userId,
        groupId,
      );
      console.log(
        '🚀 ~ ChatGateway ~ handleJoinGroup ~ userInGroup:',
        userInGroup,
      );

      if (!userInGroup) return client.emit('error', 'User not in group');
      const roomName = `group_${groupId}`;
      const userInTheRoom = this.websocketService.isSocketInRoom(
        client,
        roomName,
      );
      if (userInTheRoom) return client.emit('error', 'User alreadyIn the room');

      this.eventEmitter.emit(
        UserJoinToGroupEvent.name,
        new UserJoinToGroupEvent({
          groupId,
          userName,
          timestamp: new Date(),
          userId: Number(userId),
        }),
      );
      this.logger.log(`User ${userId} joined group ${groupId}`);
    } catch (err) {
      console.error(err);
      client.emit('socket_error', err.message);
    }
  }

  @SubscribeMessage(UserSendMessageToGroupDTO.event)
  async handleSendMessage(
    @MessageBody() data: UserSendMessageToGroupDTO,
    @ConnectedSocket() client: Socket,
  ) {
    console.log('🚀 ~ ChatGateway ~ handleSendMessage ~ data:', data);
    try {
      const { groupId, content, attachmentKey, attachmentType, messageType } =
        data;

      const { userId } = client.data;
      // const user = await this.authHelper.verifyAuthJWTToken(accessToken);
      // if (!user) return client.emit('error', 'Unauthorized');

      const roomName = WebsocketHelpers.getGroupConnectionRoom(groupId);
      if (!this.websocketService.isSocketInRoom(client, roomName)) {
        return client.emit('socket_error', 'You are not in this group');
      }
      const newMessage = await this.messageService.create({
        senderId: client.data.userId,
        content,
        attachmentKey,
        attachmentType,
        messageType,
      });
      console.log(
        '🚀 ~ ChatGateway ~ handleSendMessage ~ newMessage:',
        newMessage,
      );

      this.eventEmitter.emit(
        UserSendMessageToGroupEvent.name,
        new UserSendMessageToGroupEvent({
          groupId,
          messageId: newMessage.id,
          message: content,
          timestamp: newMessage.createdAt,
          userId: Number(userId),
        }),
      );
    } catch (err) {
      console.error(err);
      client.emit('socket_error', err.message);
    }
  }
}
