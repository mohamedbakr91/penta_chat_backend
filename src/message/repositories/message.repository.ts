import { Inject, Injectable } from '@nestjs/common';
import { Transaction } from 'sequelize';
import { IPaginatedResponse } from 'src/shared/interfaces';
import { Pagination } from 'src/shared/pagination';
import { CreateMessageDto } from '../dto/create-message.dto';
import { UpdateMessageDto } from '../dto/update-message.dto';
import { MessageDTO } from '../dto/message.dto';
import { Message } from '../entities/message.entity';
import { FindAllGroupMessagesDTO } from '../dto/find-all-group-messages';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class MessageRepository {
  constructor(@Inject('MESSAGE_MODEL') private model: typeof Message) {}

  async create(
    data: Partial<CreateMessageDto>,
    transaction?: Transaction,
  ): Promise<MessageDTO> {
    return (await this.model.create(data, { transaction })).toJSON();
  }

  async findAll(
    page: number = 1,
    limit: number = 10,
  ): Promise<IPaginatedResponse<MessageDTO>> {
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

  async fillAllGroupMessages(
    query: FindAllGroupMessagesDTO,
  ): Promise<IPaginatedResponse<MessageDTO>> {
    const paginate = new Pagination(query.page, query.limit);

    const { rows: data, count } = await this.model.findAndCountAll({
      limit: paginate.getLimit(),
      offset: paginate.getOffset(),
      where: { groupId: query.groupId },
      order: [['createdAt', 'DESC']],
      include: [
        {
          model: User,
          as: 'sender',
          attributes: ['id', 'username', 'avatar'],
        },
      ],
    });

    return {
      data: data.map((item) => item.toJSON()),
      meta: paginate.getMetaData(count),
    };
  }

  async findOne(
    id: number,
    transaction?: Transaction,
  ): Promise<MessageDTO | null> {
    const message = await this.model.findByPk(id, { transaction });
    return message ? message.toJSON() : null;
  }

  async update(
    id: number,
    data: UpdateMessageDto,
    transaction?: Transaction,
  ): Promise<MessageDTO | null> {
    const message = await this.model.findByPk(id);
    if (message) {
      await message.update(data, { transaction });
      return message.toJSON();
    }
    return null;
  }

  async delete(id: number, transaction?: Transaction): Promise<void> {
    await this.model.destroy({ where: { id }, transaction });
  }
}
