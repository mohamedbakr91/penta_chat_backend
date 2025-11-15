import { IsNotEmpty, IsNumber } from 'class-validator';

export class joinedGroupDto {
  static event = 'group:join';

  userId: number;
  @IsNotEmpty()
  @IsNumber()
  groupId: number;
}
