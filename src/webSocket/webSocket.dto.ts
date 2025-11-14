import { Socket } from 'socket.io';

export class EmitEventToRoomDto<T> {
  room: string;

  event: string;

  data?: T;
}

export class SocketJoinRoomDto {
  socket: Socket;

  room: string;
}

export class JoinRoomFromRoomDTO {
  from: string[] | string;
  to: string[] | string;
}
export class LeaveRoomFromRoomDTO {
  leavingRooms: string[] | string;
  inRooms: string[] | string;
}
