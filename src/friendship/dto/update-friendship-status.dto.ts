import { IsEnum, IsNotEmpty } from "class-validator";
import { FriendshipStatus } from "../entities/friendship.entity";

export class UpdateFriendShipStatusDTO {
  @IsNotEmpty()
  @IsEnum(FriendshipStatus)
  status: FriendshipStatus;
}
