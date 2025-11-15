import { Injectable, Logger } from '@nestjs/common';
import { Socket, Server as WSServer } from 'socket.io';
import {
  EmitEventToRoomDto,
  JoinRoomFromRoomDTO,
  LeaveRoomFromRoomDTO,
  SocketJoinRoomDto,
} from './webSocket.dto';

@Injectable()
export class WebsocketService {
  private readonly logger = new Logger(WebsocketService.name);
  server: WSServer;

  setServer(server: WSServer) {
    this.server = server;
  }
  emitToUser(userId: number, event: string, data: any) {
    try {
      const userRoom = `user_${userId}`;
      this.server.to(userRoom).emit(event, data);
    } catch (error) {
      this.logger.error(`Failed to emit to user ${userId}: ${error.message}`);
    }
  }

  emitToGroup(groupId: number, event: string, data: any) {
    try {
      const groupRoom = `group_${groupId}`;
      this.server.to(groupRoom).emit(event, data);
    } catch (error) {
      this.logger.error(`Failed to emit to group ${groupId}: ${error.message}`);
    }
  }

  isUserConnected(userId: number): boolean {
    const userRoom = `user_${userId}`;
    const roomSockets = this.server.sockets.adapter.rooms.get(userRoom);
    return roomSockets && roomSockets.size > 0;
  }

  // webSocket.dto.ts

  emitEventToRoom<T>({ event, room, data }: EmitEventToRoomDto<T>) {
    try {
      // Emit the event with the provided data to the specified room
      this.server.to(room).emit(event, data);
    } catch (error) {
      // Log or handle the error if necessary
      this.logger.error(`Failed to emit event to room: ${error.message}`);
    }
  }

  /**
   * Join a WebSocket client to a specific room.
   * This method adds a socket (client) to a room, allowing them to receive room-specific events.
   * @param {SocketJoinRoomDto} param0 - The socket (client) and the room name to join.
   * @throws - If the socket joining fails, it silently fails for now.
   */
  socketJoinRoom({ socket, room }: SocketJoinRoomDto) {
    try {
      // Join the given room
      socket.join(room);
    } catch (error) {
      // Log or handle the error if necessary
      this.logger.error(`Failed to join socket to room: ${error.message}`);
    }
  }

  /**
   * Move a WebSocket client from one room to another.
   * This method removes a socket from a source room and adds it to a target room.
   * @param {JoinRoomFromRoomDTO} param0 - The source room (`from`) and target room (`to`).
   * @throws - If the socket transfer fails, it silently fails for now.
   */
  joinRoomFromRoom({ from, to }: JoinRoomFromRoomDTO): void {
    try {
      // Move the socket from one room to another
      return this.server.in(from).socketsJoin(to);
    } catch (error) {
      // Log or handle the error if necessary
      this.logger.error(
        `Failed to move socket from room ${from} to room ${to}: ${error.message}`,
      );
    }
  }

  isSocketInRoom(socket: Socket, room: string): boolean {
    return socket.rooms.has(room);
  }

  leaveRoomFromRoom({ leavingRooms, inRooms }: LeaveRoomFromRoomDTO): void {
    try {
      // Move the socket from one room to another
      return this.server.in(inRooms).socketsLeave(leavingRooms);
    } catch (error) {
      this.logger.error(
        `Failed to leave socket from room ${inRooms} to room ${leavingRooms}: ${error.message}`,
      );
    }
  }
}
