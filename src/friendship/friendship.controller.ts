import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { UserTokenPayload } from "src/auth/dto/token-payload";
import { AuthGuard } from "src/auth/guards/jwt.guard";
import { CurrentUser } from "src/shared/decorators/currentUser";
import { IPaginatedResponse } from "src/shared/interfaces";
import { FindMyFriendshipsDTO } from "./dto/find-all-friendships.dto";
import { FriendshipDTO } from "./dto/friendship-dto";
import { UpdateFriendShipStatusDTO } from "./dto/update-friendship-status.dto";
import { FriendshipService } from "./friendship.service";

@ApiTags("Friendship Controller")
@Controller("friendship")
@ApiBearerAuth("JWT")
@UseGuards(AuthGuard)
@UsePipes(new ValidationPipe({ transform: true }))
export class FriendshipController {
  constructor(private readonly friendshipService: FriendshipService) {}

  @Get("me")
  @ApiOperation({
    summary: "Get list of accepted friends for the current user",
  })
  @ApiResponse({ type: [FriendshipDTO] })
  async findMyFriends(
    @Query() queryData: FindMyFriendshipsDTO,
    @CurrentUser() currentUser: UserTokenPayload,
  ): Promise<IPaginatedResponse<FriendshipDTO>> {
    return await this.friendshipService.findMyFriendShips({ ...queryData, userId: currentUser.userId });
  }

  @ApiOperation({ summary: "Request friendship between two users" })
  @ApiResponse({
    type: FriendshipDTO,
  })
  @Post("/user/:userId/request")
  async requestUserFriendship(
    @Param("userId", ParseIntPipe) userId: number,
    @CurrentUser() currentUser: UserTokenPayload,
  ): Promise<FriendshipDTO> {
    return await this.friendshipService.requestUserFriendship({
      userId,
      initUserId: currentUser.userId,
    });
  }

  @ApiOperation({ summary: "Block friendship between two users" })
  @ApiResponse({
    type: FriendshipDTO,
  })
  @Post("/user/:userId/block")
  async blockUser(
    @Param("userId", ParseIntPipe) userId: number,
    @CurrentUser() currentUser: UserTokenPayload,
  ): Promise<FriendshipDTO> {
    return await this.friendshipService.requestUserFriendship({
      userId,
      initUserId: currentUser.userId,
    });
  }

  @Put("/:id/status")
  @ApiResponse({ type: FriendshipDTO })
  async updateFriendShipStatus(
    @Param("id", ParseIntPipe) friendShipID: number,
    @Body() data: UpdateFriendShipStatusDTO,
    @CurrentUser() currentUser: UserTokenPayload,
  ) {
    return this.friendshipService.updateFriendShipStatus(friendShipID, data, currentUser.userId);
  }

  @Delete("/:id")
  async deleteFriendShip(
    @Param("id", ParseIntPipe) friendShipID: number,
    @CurrentUser() currentUser: UserTokenPayload,
  ): Promise<void> {
    return this.friendshipService.removeFriendship(friendShipID, currentUser.userId);
  }
}
