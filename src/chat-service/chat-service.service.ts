import {
  Inject,
  Injectable,
  UnauthorizedException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { GroupService } from 'src/group/group.service';
import { ServiceIntegrationDTO } from './dto/service-integratiom.dto';

import { ProjectService } from 'src/project/project.service';
import { UserService } from 'src/user/user.service';
import { Sequelize } from 'sequelize-typescript';
import { GroupRole } from 'src/group/entities/group-member.entity';
import { GroupMembersService } from 'src/group/group-members.service';

@Injectable()
export class ChatService {
  private readonly logger = new Logger(ChatService.name);

  constructor(
    @Inject(GroupService)
    private readonly groupService: GroupService,
    @Inject(GroupMembersService)
    private readonly groupMembersService: GroupMembersService,
    @Inject(ProjectService)
    private readonly projectService: ProjectService,

    @Inject(UserService) private readonly userService: UserService,
    @Inject('SEQUELIZE') readonly sequelize: Sequelize,
  ) {}
  // async integrateService(
  //   data: ServiceIntegrationDTO,
  // ): Promise<{ message: string }> {
  //   if (!data) throw new UnauthorizedException('No data provided');

  //   const project = await this.projectService.findOneByKey(data.key);
  //   if (!project) throw new BadRequestException('Project not found');

  //   // if (project.integration) {
  //   //   throw new BadRequestException('This project is already integrated');
  //   // }

  //   const transaction = await this.sequelize.transaction();

  //   try {
  //     for (const grp of data.data) {
  //       if (!grp.key) throw new BadRequestException('Group must have a key');
  //       if (!Array.isArray(grp.users)) {
  //         throw new BadRequestException(
  //           `Users of group ${grp.key} must be an array`,
  //         );
  //       }

  //       // --------------------------------------------------
  //       // 1) Create/Find users & collect membersForCreate
  //       // --------------------------------------------------
  //       const membersForCreate: {
  //         userId: number;
  //         role: GroupRole;
  //       }[] = [];

  //       for (const usr of grp.users) {
  //         const user = await this.userService.findOrCreate(
  //           {
  //             userProjectId: usr.id,
  //             userName: usr.userName,
  //             projectId: project.id,
  //             avatar: usr.avatar,
  //             firstName: usr.firstName,
  //             userSecretKey: usr.userSecretKey,
  //           },
  //           transaction,
  //         );

  //         membersForCreate.push({
  //           userId: user.id,
  //           role: usr.role || GroupRole.MEMBER,
  //         });
  //       }

  //       // --------------------------------------------------
  //       // 2) Check if group exists
  //       // --------------------------------------------------
  //       let group = await this.groupService.findOneByKey(grp.key, transaction);

  //       if (!group) {
  //         // 3) Create group
  //         group = await this.groupService.create(
  //           {
  //             key: grp.key,
  //             projectId: project.id,
  //           },
  //           transaction,
  //         );

  //         // 4) Add members
  //         for (const member of membersForCreate) {
  //           await this.groupMembersService.findOrCreateMember(
  //             { groupId: group.id, role: member.role, userId: member.userId },
  //             transaction,
  //           );
  //         }
  //       }
  //     }

  //     // --------------------------------------------------
  //     // 5) Mark project integrated
  //     // --------------------------------------------------
  //     // await this.projectService.update(
  //     //   project.id,
  //     //   {
  //     //     integration: true,
  //     //     firstData: data,
  //     //   },
  //     //   transaction,
  //     // );

  //     await transaction.commit();
  //     return { message: 'Groups and members created successfully' };
  //   } catch (error) {
  //     await transaction.rollback();
  //     this.logger.error(`Integration failed: ${error.message}`, error.stack);
  //     throw error;
  //   }
  // }

  async getUserGroups(
    key: string,
    id: number,
    userName: string,
    userSecretKey: string,
  ) {
    const project = await this.projectService.findOneByKey(key);
    // if (!project || !project.firstData) {
    //   throw new UnauthorizedException('Invalid secretKey');
    // }
    const user = await this.userService.findByUserNameAndSecretKey(
      userName,
      userSecretKey,
    );

    if (!user) throw new UnauthorizedException('User not found');
    if (user.id !== id) throw new UnauthorizedException('User not found');
    const groups = await this.groupMembersService.findGroupsByUserId(user.id);

    return {
      user: {
        id: user.id,
        userName: user.userName,
        avatar: user.avatar,
      },
      groups,
    };
  }
}
