import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  WebSocketServer,
  OnGatewayInit,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Injectable, Logger } from '@nestjs/common';
import { AuthHelper } from 'src/auth/auth-helper.service';
import { GroupMembersService } from 'src/group-members/group-members.service';
import { WebsocketService } from 'src/webSocket/webSocket.service';
import { ChatService } from './chat-service.service';

@WebSocketGateway({ namespace: '/chat' })
@Injectable()
export class ChatGateway implements OnGatewayInit {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(ChatGateway.name);

  constructor(
    private readonly authHelper: AuthHelper,
    private readonly chatService: ChatService,
    private readonly websocketService: WebsocketService,
    private readonly groupMembersService: GroupMembersService,
  ) {}

  afterInit(server: Server) {
    // حفظ الـ server في الـ WebsocketService
    this.websocketService.setServer(server);
    this.logger.log('ChatGateway initialized');
  }

  @SubscribeMessage('joinGroup')
  async handleJoinGroup(
    @MessageBody() data: { accessToken: string; groupId: number },
    @ConnectedSocket() client: Socket,
  ) {
    try {
      const { accessToken, groupId } = data;
      const user = await this.authHelper.verifyAuthJWTToken(accessToken);
      if (!user) return client.emit('error', 'Unauthorized');

      // تحقق من عضوية المستخدم في الغرفة
      const userInGroup = await this.groupMembersService.userInGroup(
        user.userId,
        groupId,
      );
      if (!userInGroup) return client.emit('error', 'User not in group');

      // انضمام المستخدم للغرفة
      const roomName = `group_${groupId}`;
      this.websocketService.socketJoinRoom({ socket: client, room: roomName });

      client.emit('joinedGroup', { groupId });
      this.logger.log(`User ${user.userId} joined group ${groupId}`);
    } catch (err) {
      client.emit('error', err.message);
    }
  }

  @SubscribeMessage('sendMessage')
  async handleSendMessage(
    @MessageBody()
    data: { accessToken: string; groupId: number; message: string },
    @ConnectedSocket() client: Socket,
  ) {
    try {
      const { accessToken, groupId, message } = data;
      const user = await this.authHelper.verifyAuthJWTToken(accessToken);
      if (!user) return client.emit('error', 'Unauthorized');

      const roomName = `group_${groupId}`;

      if (!this.websocketService.isSocketInRoom(client, roomName)) {
        return client.emit('error', 'You are not in this group');
      }

      this.websocketService.emitEventToRoom({
        event: 'newMessage',
        room: roomName,
        data: {
          userId: user.userId,
          message,
          timestamp: new Date(),
        },
      });

      await this.chatService.saveMessage({
        groupId,
        userId: user.userId,
        message,
      });
    } catch (err) {
      client.emit('error', err.message);
    }
  }
}
