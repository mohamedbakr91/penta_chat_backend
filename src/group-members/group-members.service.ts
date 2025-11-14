import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { IPaginatedResponse } from 'src/shared/interfaces';
import { CreateGroupMemberDto } from './dto/create-group-member.dto';
import { UpdateGroupMemberDto } from './dto/update-group-member.dto';
import { GroupMemberDTO } from './dto/group-member.dto';
import { GroupMemberRepository } from './repositories/group-member.repository';
import { findOrCreateMemberDto } from './dto/find-or-create';
import { Transaction } from 'sequelize';

@Injectable()
export class GroupMembersService {
  private readonly logger = new Logger(GroupMembersService.name);

  constructor(
    @Inject(GroupMemberRepository)
    private readonly repository: GroupMemberRepository,
  ) {}

  async create(
    createGroupMemberDto: CreateGroupMemberDto,
    transaction: Transaction,
  ): Promise<GroupMemberDTO> {
    try {
      const groupMember = await this.repository.create(
        createGroupMemberDto,
        transaction,
      );
      this.logger.log(`Group member created: ${groupMember.id}`);
      return groupMember;
    } catch (error) {
      this.logger.error(
        `Error creating group member: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async findAll(
    page: number = 1,
    limit: number = 10,
  ): Promise<IPaginatedResponse<GroupMemberDTO>> {
    return await this.repository.findAll(page, limit);
  }

  async findOne(id: number): Promise<GroupMemberDTO> {
    const groupMember = await this.repository.findOne(id);
    if (!groupMember) {
      throw new BadRequestException(`Group member with id ${id} not found`);
    }
    return groupMember;
  }

  async findOrCreateMember(
    data: findOrCreateMemberDto,
    transaction: Transaction,
  ) {
    const { groupId, userId, role } = data;

    // check if exists
    const existing = await this.repository.findByGroupIdAndUserId(
      groupId,
      userId,
      transaction,
    );

    if (existing) {
      // already exists → return it
      return existing;
    }

    // create new
    return this.repository.create({
      groupId,
      userId,
      role,
    });
  }
  async update(
    id: number,
    updateGroupMemberDto: UpdateGroupMemberDto,
  ): Promise<GroupMemberDTO> {
    const groupMember = await this.repository.findOne(id);
    if (!groupMember) {
      throw new BadRequestException(`Group member with id ${id} not found`);
    }

    const updatedGroupMember = await this.repository.update(
      id,
      updateGroupMemberDto,
    );
    if (!updatedGroupMember) {
      throw new BadRequestException(
        `Failed to update group member with id ${id}`,
      );
    }

    return updatedGroupMember;
  }

  async findGroupsByUserId(userId: number): Promise<GroupMemberDTO[]> {
    return await this.repository.findGroupsByUserId(userId);
  }

  async userInGroup(
    userId: number,
    groupId: number,
  ): Promise<GroupMemberDTO | null> {
    const userInGroup = await this.repository.findByGroupIdAndUserId(
      groupId,
      userId,
    );
    return userInGroup ?? null;
  }

  async remove(id: number): Promise<void> {
    const groupMember = await this.repository.findOne(id);
    if (!groupMember) {
      throw new BadRequestException(`Group member with id ${id} not found`);
    }

    await this.repository.delete(id);
  }
}
