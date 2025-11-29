import {
  BadRequestException,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { GroupMembersService } from './group-members.service';
import { GroupMemberDTO } from './dto/groupMembers/group-member.dto';
import { CurrentUser } from 'src/shared/decorators/currentUser';
import { UserDTO } from 'src/user/dto/user.dto';
import { AuthGuard } from 'src/auth/guards/jwt.guard';
import { UserTokenPayload } from 'src/auth/dto/token-payload';

@ApiTags('Group User')
@Controller('group/user')
@ApiBearerAuth('JWT')
@UseGuards(AuthGuard)
export class GroupUserController {
  constructor(private readonly groupMembersService: GroupMembersService) {}

  @Get(':userId')
  @ApiOperation({ summary: 'Get groups for a given user' })
  @ApiResponse({ type: [GroupMemberDTO] })
  async findGroupsByUserId(
    @Param('userId', ParseIntPipe) userId: number,
    @CurrentUser() user: any,
  ): Promise<GroupMemberDTO[]> {
    console.log(
      '🚀 ~ GroupUserController ~ findGroupsByUserId ~ userId:',
      userId,
    );

    // Log JSON stringified to reveal actual enumerable properties

    if (!userId || !user?.userId) {
      throw new BadRequestException('User context is missing or invalid');
    }
    return this.groupMembersService.findGroupsByUserId(userId);
  }
}
