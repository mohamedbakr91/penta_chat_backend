import { Inject, Injectable } from '@nestjs/common';
import { Transaction } from 'sequelize';
import { IPaginatedResponse } from 'src/shared/interfaces';
import { Pagination } from 'src/shared/pagination';
import { CreateGroupDto } from '../dto/create-group.dto';
import { UpdateGroupDto } from '../dto/update-group.dto';
import { GroupDTO } from '../dto/group.dto';
import { Group } from '../entities/group.entity';

@Injectable()
export class GroupRepository {
  constructor(@Inject('GROUP_MODEL') private model: typeof Group) {}

  async create(
    data: Partial<CreateGroupDto>,
    transaction?: Transaction,
  ): Promise<GroupDTO> {
    return (
      await this.model.create(
        { key: data.key, projectId: data.projectId },
        { transaction },
      )
    ).toJSON();
  }

  async findAll(
    page: number = 1,
    limit: number = 10,
  ): Promise<IPaginatedResponse<GroupDTO>> {
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

  async findOne(id: number): Promise<GroupDTO | null> {
    const group = await this.model.findByPk(id);
    return group ? group.toJSON() : null;
  }

  async findOneByKey(
    key: string,
    transaction?: Transaction,
  ): Promise<GroupDTO | null> {
    const group = await this.model.findOne({ where: { key }, transaction });
    return group ? group.toJSON() : null;
  }

  // !TODO :FIXUP_DATE
  async update(
    id: number,
    data: UpdateGroupDto,
    transaction?: Transaction,
  ): Promise<GroupDTO | null> {
    const group = await this.model.findByPk(id);
    if (group) {
      await group.update({}, { transaction });
      return group.toJSON();
    }
    return null;
  }

  async delete(id: number, transaction?: Transaction): Promise<void> {
    await this.model.destroy({ where: { id }, transaction });
  }
}
