import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { IPaginatedResponse } from 'src/shared/interfaces';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { MessageDTO } from './dto/message.dto';
import { MessageRepository } from './repositories/message.repository';
import { Transaction } from 'sequelize';

@Injectable()
export class MessageService {
  private readonly logger = new Logger(MessageService.name);

  constructor(
    @Inject(MessageRepository)
    private readonly repository: MessageRepository,
  ) {}

  async create(
    data: CreateMessageDto,
    transaction: Transaction,
  ): Promise<MessageDTO> {
    try {
      const message = await this.repository.create(data, transaction);

      this.logger.log(`Message created: ${message.id}`);
      return message;
    } catch (error) {
      this.logger.error(
        `Error creating message: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async findAll(
    page: number = 1,
    limit: number = 10,
  ): Promise<IPaginatedResponse<MessageDTO>> {
    return await this.repository.findAll(page, limit);
  }

  async findOne(id: number): Promise<MessageDTO> {
    const message = await this.repository.findOne(id);
    if (!message) {
      throw new BadRequestException(`Message with id ${id} not found`);
    }
    return message;
  }

  async update(
    id: number,
    updateMessageDto: UpdateMessageDto,
  ): Promise<MessageDTO> {
    const message = await this.repository.findOne(id);
    if (!message) {
      throw new BadRequestException(`Message with id ${id} not found`);
    }

    const updatedMessage = await this.repository.update(id, updateMessageDto);
    if (!updatedMessage) {
      throw new BadRequestException(`Failed to update message with id ${id}`);
    }

    return updatedMessage;
  }

  async remove(id: number): Promise<void> {
    const message = await this.repository.findOne(id);
    if (!message) {
      throw new BadRequestException(`Message with id ${id} not found`);
    }

    await this.repository.delete(id);
  }
}
