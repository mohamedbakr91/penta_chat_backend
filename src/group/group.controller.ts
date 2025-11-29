import {
  BadRequestException,
  Body,
  Controller,
  DefaultValuePipe,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { GroupService } from './group.service';
import { CreateGroupDto } from './dto/group/create-group.dto';
import { GroupDTO } from './dto/group/group.dto';
import { ProjectGuard } from 'src/auth/guards/project.guard';
import { CurrentProject } from 'src/shared/decorators/currentProject';
import { AddGroupMembersDto } from './dto/group/add-group-members.dto';
import { GroupMemberDTO } from './dto/groupMembers/group-member.dto';
import { IPaginatedResponse } from 'src/shared/interfaces';

import { GroupMembersService } from './group-members.service';

@ApiTags('Group Controller')
@Controller('group')
@ApiBearerAuth('JWT')
@UseGuards(ProjectGuard)
export class GroupController {
  constructor(private readonly groupService: GroupService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new group inside the current project' })
  @ApiResponse({ type: GroupDTO })
  async createGroup(
    @Body() data: CreateGroupDto,
    @CurrentProject() project: any,
  ): Promise<GroupDTO> {
    const payload: CreateGroupDto = {
      name: data.name,
      projectId: project.id,
    };
    return this.groupService.create(payload);
  }

  @Get()
  @ApiOperation({ summary: 'List groups (paginated)' })
  async findAll(
    @CurrentProject() project: any,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ): Promise<IPaginatedResponse<GroupDTO>> {
    return this.groupService.findAll(project.id, page, limit);
  }

  @Post(':groupName/members')
  @ApiOperation({
    summary: 'Add members to an existing group',
    description:
      'Creates users (if not exist) and adds them to the group in a single transaction',
  })
  @ApiResponse({ type: [GroupMemberDTO] })
  async addMembersToGroup(
    @Param('groupName') groupName: string,
    @Body() body: AddGroupMembersDto,
    @CurrentProject() project: any,
  ): Promise<GroupMemberDTO[]> {
    if (!project || !project.id) {
      throw new BadRequestException('Project context is missing or invalid');
    }

    return this.groupService.addMembersToGroup(
      groupName,
      body.members,
      project.id,
    );
  }
}
