import { BadRequestException, Inject, Injectable, Logger } from "@nestjs/common";
import { IPaginatedResponse } from "src/shared/interfaces";
import { UserService } from "src/user/user.service";
import { BlockUserDTO } from "./dto/block-user-friendship.dto";
import { CreateFriendshipDTO } from "./dto/create-friendship.dto";
import { FindMyFriendshipsDTO } from "./dto/find-all-friendships.dto";
import { FriendshipDTO } from "./dto/friendship-dto";
import { UpdateFriendShipStatusDTO } from "./dto/update-friendship-status.dto";
import { FriendshipStatus } from "./entities/friendship.entity";
import { FriendshipRepository } from "./repositories/friendship.repository";

@Injectable()
export class FriendshipService {
  private readonly logger = new Logger(FriendshipService.name);

  constructor(
    @Inject(FriendshipRepository)
    private readonly repository: FriendshipRepository,
    @Inject(UserService) private readonly userService: UserService,
  ) {}

  async requestUserFriendship(data: CreateFriendshipDTO): Promise<FriendshipDTO> {
    await this.userService.findOneById(data.userId);

    try {
      const existingFriendship = await this.repository.findFriendship(data.initUserId, data.userId);

      if (existingFriendship) {
        throw new BadRequestException("Friendship already exsists with status " + existingFriendship.status);
      }

      const friendship = await this.repository.createFriendship({
        initUserId: data.initUserId,

        userId1: data.initUserId,

        userId2: data.userId,

        status: FriendshipStatus.pending,
      });

      this.logger.log(`Friendship request created: ${friendship.id}`);

      return friendship;
    } catch (error) {
      this.logger.error(`Error creating friendship: ${error.message}`, error.stack);
      throw error;
    }
  }

  async updateFriendShipStatus(
    friendShipId: number,
    data: UpdateFriendShipStatusDTO,
    currentUserId: number,
  ): Promise<FriendshipDTO> {
    const friendShip = await this.repository.findById(friendShipId);

    if (!friendShip) throw new BadRequestException("Invalid friendship id");

    if (friendShip.userId1 !== currentUserId && friendShip.userId2 !== currentUserId) {
      throw new BadRequestException("Invalid friendship id");
    }

    switch (data.status) {
      case FriendshipStatus.accepted: {
        if (friendShip.status !== FriendshipStatus.pending) {
          throw new BadRequestException("Friendship status is not pending");
        }

        break;
      }

      case FriendshipStatus.blocked: {
        if (friendShip.status !== FriendshipStatus.accepted) {
          throw new BadRequestException("Friendship status is not pending");
        }

        break;
      }

      default: {
        throw new BadRequestException("Invalid status");
      }
    }

    const updatedFriendShip = await this.repository.updateFriendshipStatus(friendShip.id, data.status);

    return updatedFriendShip;
  }

  async removeFriendship(friendShipId: number, currentUserId: number): Promise<void> {
    const friendShip = await this.repository.findById(friendShipId);

    if (!friendShip) throw new BadRequestException("Invalid friendship id");

    if (friendShip.userId1 !== currentUserId && friendShip.userId2 !== currentUserId) {
      throw new BadRequestException("Invalid friendship id");
    }

    await this.repository.deleteFriendship(friendShip.id);
  }

  async blockUser(data: BlockUserDTO): Promise<void> {
    await this.userService.findOneById(data.userId);

    const existingFriendship = await this.repository.findFriendship(data.initUserId, data.userId);

    if (!existingFriendship) {
      await this.repository.createFriendship({
        initUserId: data.initUserId,
        userId1: data.initUserId,
        userId2: data.userId,
      });
    } else {
      await this.repository.updateFriendshipStatus(existingFriendship.id, FriendshipStatus.blocked);
    }
  }

  async findMyFriendShips(queryData: FindMyFriendshipsDTO): Promise<IPaginatedResponse<FriendshipDTO>> {
    const friendShipts = await this.repository.findAllFriendShips(queryData);

    return friendShipts;
  }
}
