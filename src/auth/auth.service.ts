import {
  Inject,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { AuthHelper } from './auth-helper.service';
import { LoginDTO } from './dto/login.dto';
import { UserTokenPayload } from './dto/token-payload';
import { ProjectService } from 'src/project/project.service';
import { GroupMember } from 'src/group-members/entities/group-member.entity';
import { GroupMembersService } from 'src/group-members/group-members.service';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @Inject(UserService) private readonly userService: UserService,
    @Inject(AuthHelper) private readonly authHelper: AuthHelper,
    @Inject(ProjectService) private readonly projectService: ProjectService,
    @Inject(GroupMembersService)
    private readonly groupMembersService: GroupMembersService,
  ) {}

  async loginExternal(dto: LoginDTO) {
    const project = await this.projectService.findOneByKey(dto.projectKey);
    if (!project || !project.firstData) {
      throw new UnauthorizedException('Invalid secretKey');
    }

    const user = await this.userService.findByUserNameAndSecretKey(
      dto.userName,
      dto.userSecretKey,
    );
    if (!user) throw new UnauthorizedException('User not found');

    if (dto.id && user.id !== dto.id) {
      throw new UnauthorizedException('User ID mismatch');
    }

    const groups = await this.groupMembersService.findGroupsByUserId(user.id);

    const payload: UserTokenPayload = {
      userId: user.id,
      userName: user.userName,
      projectId: project.id,
    };
    const accessToken = await this.authHelper.generateAuthJWTToken(payload);

    this.logger.log(`User ${user.id} logged in successfully`);

    return {
      message: 'Logged in successfully',
      accessToken,
      user: {
        id: user.id,
        userName: user.userName,
        avatar: user.avatar,
      },
      groups,
    };
  }
}
