import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { IPaginatedResponse } from 'src/shared/interfaces';
import { CreateGroupDto } from './dto/group/create-group.dto';
import { UpdateGroupDto } from './dto/group/update-group.dto';
import { GroupDTO } from './dto/group/group.dto';
import { GroupRepository } from './repositories/group.repository';
import { GroupMembersService } from 'src/group/group-members.service';
import { Sequelize } from 'sequelize-typescript';
import { Transaction } from 'sequelize';
import { GroupMemberDTO } from './dto/groupMembers/group-member.dto';
import { GeneratorHelper } from 'src/shared/helpers/generator';
import { UserService } from 'src/user/user.service';
import { AddGroupMemberUserDto } from './dto/group/add-group-members.dto';

@Injectable()
export class GroupService {
  private readonly logger = new Logger(GroupService.name);

  constructor(
    @Inject(GroupRepository)
    private readonly repository: GroupRepository,
    @Inject(GroupMembersService)
    private readonly groupMembersService: GroupMembersService,
    @Inject(UserService) private readonly userService: UserService,
    @Inject('SEQUELIZE') readonly sequelize: Sequelize,
  ) {}

  async create(
    data: CreateGroupDto,
    transaction?: Transaction,
  ): Promise<GroupDTO> {
    try {
      const isFound = await this.findByGroupNameAndProjectId(
        data.name,
        data.projectId,
      );

      if (isFound)
        throw new BadRequestException(
          `Group with name ${data.name} found for this project before`,
        );
      const key = GeneratorHelper.generateRandomAlphaNumeric(8);
      const group = await this.repository.create({ ...data, key: key });

      this.logger.log(`Group created: ${group.id}`);

      return group;
    } catch (error) {
      this.logger.error(`Error creating group: ${error.message}`, error.stack);
      throw error;
    }
  }

  async addMembersToGroup(
    name: string,
    members: AddGroupMemberUserDto[],
    projectId: number,
  ): Promise<GroupMemberDTO[]> {
    if (!projectId) {
      throw new BadRequestException('Project ID is required');
    }

    const group = await this.findByGroupNameAndProjectId(name, projectId);

    if (!group) {
      throw new BadRequestException(`Group with name ${name} not found`);
    }

    const tx = await this.sequelize.transaction();

    try {
      const createdMembers: GroupMemberDTO[] = [];

      for (const member of members) {
        // Extract user data (without role)
        const { role, ...userData } = member;

        // Prepare user data with projectId
        const userCreateData = {
          ...userData,
          projectId: projectId,
        };

        // Validate that projectId is set
        if (!userCreateData.projectId) {
          throw new BadRequestException(
            `Project ID is missing for user: ${member.userName}`,
          );
        }

        // Find or create user
        const user = await this.userService.findOrCreate(userCreateData, tx);

        if (!user) {
          throw new BadRequestException(
            `Failed to create or find user: ${member.userName}`,
          );
        }

        // Add user to group with role
        const createdMember = await this.groupMembersService.findOrCreateMember(
          {
            groupId: group.id,
            userId: user.id,
            role: role,
          },
          tx,
        );
        createdMembers.push(createdMember);
      }

      await tx.commit();
      return createdMembers;
    } catch (error) {
      await tx.rollback();
      this.logger.error(
        `Error adding members to group ${group?.id ?? name}: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async findByGroupNameAndProjectId(
    name: string,
    projectId: number,
    transaction?: Transaction,
  ): Promise<GroupDTO> {
    const group = await this.repository.findOneByNameAndProjectId(
      name,
      projectId,
      transaction,
    );

    return group;
  }

  async findAll(
    projectId: number,
    page: number = 1,
    limit: number = 10,
  ): Promise<IPaginatedResponse<GroupDTO>> {
    return await this.repository.findAll(page, limit, projectId);
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
