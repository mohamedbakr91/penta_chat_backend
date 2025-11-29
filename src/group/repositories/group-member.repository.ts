import { Inject, Injectable } from '@nestjs/common';
import { Transaction } from 'sequelize';
import { IPaginatedResponse } from 'src/shared/interfaces';
import { Pagination } from 'src/shared/pagination';
import { CreateGroupMemberDto } from '../dto/groupMembers/create-group-member.dto';
import { UpdateGroupMemberDto } from '../dto/groupMembers/update-group-member.dto';
import { GroupMemberDTO } from '../dto/groupMembers/group-member.dto';
import { GroupMember } from '../entities/group-member.entity';
import { Group } from 'src/group/entities/group.entity';

@Injectable()
export class GroupMemberRepository {
  constructor(
    @Inject('GROUP_MEMBER_MODEL') private model: typeof GroupMember,
  ) {}

  async create(
    data: Partial<CreateGroupMemberDto>,
    transaction?: Transaction,
  ): Promise<GroupMemberDTO> {
    return (await this.model.create(data, { transaction })).toJSON();
  }

  async findByGroupIdAndUserId({
    groupId,
    userId,
    transaction,
  }: {
    groupId: number;
    userId: number;
    transaction?: Transaction;
  }) {
    return this.model.findOne({
      where: { groupId, userId },
      include: [
        {
          model: Group,
          as: 'group',
          attributes: ['id', 'key', 'projectId'],
        },
      ],
      transaction,
    });
  }
  async findGroupsByUserId(userId: number): Promise<GroupMemberDTO[]> {
    return this.model.findAll({
      where: { userId },
      include: [
        {
          model: Group,
          as: 'group',
          attributes: ['id', 'key', 'projectId', 'name'],
        },
      ],
    });
  }

  async findAll(
    page: number = 1,
    limit: number = 10,
  ): Promise<IPaginatedResponse<GroupMemberDTO>> {
    const paginate = new Pagination(page, limit);

    const { rows: data, count } = await this.model.findAndCountAll({
      limit: paginate.getLimit(),
      offset: paginate.getOffset(),
    });

    return {
      data: data.map((item) => item.toJSON()),
      meta: paginate.getMetaData(count),
    };
  }

  async findOne(id: number): Promise<GroupMemberDTO | null> {
    const groupMember = await this.model.findByPk(id);
    return groupMember ? groupMember.toJSON() : null;
  }

  async update(
    id: number,
    data: UpdateGroupMemberDto,
    transaction?: Transaction,
  ): Promise<GroupMemberDTO | null> {
    const groupMember = await this.model.findByPk(id);
    if (groupMember) {
      await groupMember.update(data, { transaction });
      return groupMember.toJSON();
    }
    return null;
  }

  async delete(id: number, transaction?: Transaction): Promise<void> {
    await this.model.destroy({ where: { id }, transaction });
  }
}
