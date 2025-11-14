import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { IPaginatedResponse } from 'src/shared/interfaces';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { GroupDTO } from './dto/group.dto';
import { GroupRepository } from './repositories/group.repository';
import { GroupMembersService } from 'src/group-members/group-members.service';
import { Sequelize } from 'sequelize-typescript';
import { Transaction } from 'sequelize';

@Injectable()
export class GroupService {
  private readonly logger = new Logger(GroupService.name);

  constructor(
    @Inject(GroupRepository)
    private readonly repository: GroupRepository,

    @Inject(GroupMembersService)
    private readonly groupMembersService: GroupMembersService,
    @Inject('SEQUELIZE') readonly sequelize: Sequelize,
  ) {}

  async create(
    data: CreateGroupDto,
    transaction: Transaction,
  ): Promise<GroupDTO> {
    try {
      const group = await this.repository.create(data, transaction);

      this.logger.log(`Group created: ${group.id}`);
      return group;
    } catch (error) {
      this.logger.error(`Error creating group: ${error.message}`, error.stack);
      throw error;
    }
  }

  async findAll(
    page: number = 1,
    limit: number = 10,
  ): Promise<IPaginatedResponse<GroupDTO>> {
    return await this.repository.findAll(page, limit);
  }

  async findOne(id: number): Promise<GroupDTO> {
    const group = await this.repository.findOne(id);
    if (!group) {
      throw new BadRequestException(`Group with id ${id} not found`);
    }
    return group;
  }

  async findOneByKey(key: string, transaction: Transaction): Promise<GroupDTO> {
    const group = await this.repository.findOneByKey(key, transaction);
    if (!group) {
      throw new BadRequestException(`Group with key ${key} not found`);
    }
    return group;
  }
  async update(id: number, updateGroupDto: UpdateGroupDto): Promise<GroupDTO> {
    const group = await this.repository.findOne(id);
    if (!group) {
      throw new BadRequestException(`Group with id ${id} not found`);
    }

    const updatedGroup = await this.repository.update(id, updateGroupDto);
    if (!updatedGroup) {
      throw new BadRequestException(`Failed to update group with id ${id}`);
    }

    return updatedGroup;
  }

  async remove(id: number): Promise<void> {
    const group = await this.repository.findOne(id);
    if (!group) {
      throw new BadRequestException(`Group with id ${id} not found`);
    }

    await this.repository.delete(id);
  }
}
