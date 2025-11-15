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
import { GroupMembersService } from 'src/group-members/group-members.service';
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

@WebSocketGateway({ namespace: '/chat' })
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
    private readonly redisIoAdapter: RedisIoAdapter, // Redis adapter injected
  ) {}

  afterInit() {
    this.websocketService.setServer(this.server);
    this.logger.log('ChatGateway initialized');
  }

  // -----------------------------
  // 1️⃣ Handle User Connection
  // -----------------------------
  private async handleUserConnection(userId: number) {
    const redisClient = this.redisIoAdapter.getClient();

    // Online status
    await redisClient.set(`user:${userId}:online`, '1');
    await redisClient.expire(`user:${userId}:online`, 30); // TTL 30s

    // Broadcast to all that user is online
    this.server.emit('userOnline', { userId });
  }

  // -----------------------------
  // 2️⃣ Handle User Disconnection
  // -----------------------------
  private async handleUserDisconnection(userId: number) {
    const redisClient = this.redisIoAdapter.getClient();

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
      //todo:خرجه من كل الروكز؟

      this.websocketService.socketJoinRoom({
        socket: socket,
        room: WebsocketHelpers.getUserConnectionRoom(user.userId),
      });
      await this.handleUserConnection(user.userId);
    } catch (error) {
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

    const redisClient = this.redisIoAdapter.getClient();
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
      const { groupId, userId } = data;
      const { projectId, userName } = client.data;
      const userInGroup = await this.groupMembersService.userInGroup(
        userId,
        projectId,
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
      client.emit('error', err.message);
    }
  }

  @SubscribeMessage(UserSendMessageToGroupDTO.event)
  async handleSendMessage(
    @MessageBody() data: UserSendMessageToGroupDTO,
    @ConnectedSocket() client: Socket,
  ) {
    try {
      const { groupId, content, attachmentKey, attachmentType } = data;

      const { userId } = client.data;
      // const user = await this.authHelper.verifyAuthJWTToken(accessToken);
      // if (!user) return client.emit('error', 'Unauthorized');

      const roomName = `group_${groupId}`;

      if (!this.websocketService.isSocketInRoom(client, roomName)) {
        return client.emit('error', 'You are not in this group');
      }

      const newMessage = await this.messageService.create({
        senderId: client.data.id,
        content,
        attachmentKey,
        attachmentType,
      });

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
      client.emit('error', err.message);
    }
  }
}
