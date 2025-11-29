import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { UniqueConstraintError } from 'sequelize';
import { IPaginatedResponse } from 'src/shared/interfaces';
import { CreateGroupMemberDto } from './dto/groupMembers/create-group-member.dto';
import { UpdateGroupMemberDto } from './dto/groupMembers/update-group-member.dto';
import { GroupMemberDTO } from './dto/groupMembers/group-member.dto';
import { GroupMemberRepository } from './repositories/group-member.repository';
import { findOrCreateMemberDto } from './dto/groupMembers/find-or-create';
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
    transaction?: Transaction,
  ) {
    const { groupId, userId, role } = data;

    // Try to create directly to avoid race between check + insert
    try {
      const created = await this.repository.create(
        {
          groupId,
          userId,
          role,
        },
        transaction,
      );
      return created;
    } catch (error) {
      // If another transaction inserted the same (unique constraint), fetch and return it
      if (
        error instanceof UniqueConstraintError ||
        error?.original?.code === 'ER_DUP_ENTRY'
      ) {
        const existing = await this.repository.findByGroupIdAndUserId({
          groupId,
          userId,
          transaction,
        });
        if (existing) return existing;
      }

      // For lock wait timeout or other DB errors, rethrow to let caller handle rollback/retry
      this.logger.error(
        `Error creating group member: ${error.message}`,
        error.stack,
      );
      throw error;
    }
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
    const userInGroup = await this.repository.findByGroupIdAndUserId({
      groupId,
      userId,
    });
    return userInGroup ?? null;
  }

  async remove(id: number): Promise<void> {
    const groupMember = await this.repository.findOne(id);
    if (!groupMember) {
      throw new BadRequestException(`Group member with id ${id} not found`);
    }

    await this.repository.delete(id);
  }

  async updateLastSeen(
    userId: number,
    groupId: number,
    lastSeenMessageId: number,
    lastSeenAt: Date,
  ): Promise<GroupMemberDTO> {
    const member = await this.repository.findByGroupIdAndUserId({
      groupId,
      userId,
    });

    if (!member) {
      throw new BadRequestException('User is not a member of this group');
    }

    const updatedMember = await this.repository.update(member.id, {
      lastSeenMessageId,
      lastSeenAt,
    });

    if (!updatedMember) {
      throw new BadRequestException('Failed to update group member');
    }

    return updatedMember;
  }
}
