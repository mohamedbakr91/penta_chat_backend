import { Inject, Injectable } from "@nestjs/common";
import { Op, Transaction } from "sequelize";
import { IPaginatedResponse } from "src/shared/interfaces";
import { Pagination } from "src/shared/pagination";
import { User } from "src/user/entities/user.entity";
import { FindMyFriendshipsDTO } from "../dto/find-all-friendships.dto";
import { FriendshipDTO } from "../dto/friendship-dto";
import { Friendship, FriendshipStatus } from "../entities/friendship.entity";

@Injectable()
export class FriendshipRepository {
  constructor(@Inject("FRIENDSHIP_MODEL") private model: typeof Friendship) {}

  async createFriendship(data: Partial<FriendshipDTO>, transaction?: Transaction): Promise<FriendshipDTO> {
    return (await this.model.create(data, { transaction })).toJSON();
  }

  async findById(id: number): Promise<FriendshipDTO | null> {
    const friendship = await this.model.findByPk(id);

    return friendship ? friendship.toJSON() : null;
  }

  async findFriendship(userId1: number, userId2: number): Promise<FriendshipDTO | null> {
    return await this.model.findOne({
      where: {
        [Op.or]: [
          { userId1: userId1, userId2: userId2 },
          { userId1: userId2, userId2: userId1 },
        ],
      },
    });
  }

  async findAllFriendShips(queryData: FindMyFriendshipsDTO): Promise<IPaginatedResponse<FriendshipDTO>> {
    const paginate = new Pagination(queryData.page, queryData.limit);

    const whereClause: any = {
      ...(queryData.userId
        ? {
            [Op.or]: [{ userId1: queryData.userId }, { userId2: queryData.userId }],
          }
        : {}),

      ...(queryData.status
        ? {
            status: queryData.status,
          }
        : {}),
    };

    const { rows: data, count } = await this.model.findAndCountAll({
      limit: paginate.getLimit(),
      offset: paginate.getOffset(),
      where: whereClause,
      include: [
        {
          model: User,
          as: "user1",
          attributes: ["id", "userName", "firstName"],
        },
        {
          model: User,
          as: "user2",
          attributes: ["id", "userName", "firstName"],
        },
      ],
    });

    return {
      data,
      meta: paginate.getMetaData(count),
    };
  }

  async updateFriendshipStatus(id: number, status: FriendshipStatus): Promise<FriendshipDTO | null> {
    const friendship = await this.model.findByPk(id);
    if (friendship) {
      await friendship.update({ status });
      return friendship.toJSON();
    }
    return null;
  }

  async deleteFriendship(id: number): Promise<void> {
    await this.model.destroy({ where: { id } });
  }
}
