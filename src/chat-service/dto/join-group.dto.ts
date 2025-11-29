import { IsNotEmpty, IsNumber } from 'class-validator';
import { Events } from '../events/events.dto';

export class joinedGroupDto {
  static event = Events.JOIN_GROUP;

  userId: number;
  @IsNotEmpty()
  @IsNumber()
  groupId: number;
}
