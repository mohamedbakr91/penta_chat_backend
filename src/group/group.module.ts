import { forwardRef, Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { Group } from './entities/group.entity';
import { GroupController } from './group.controller';
import { GroupService } from './group.service';
import { GroupRepository } from './repositories/group.repository';
import { GroupMember } from './entities/group-member.entity';
import { GroupMemberRepository } from './repositories/group-member.repository';
import { GroupMembersService } from './group-members.service';
import { ProjectModule } from 'src/project/project.module';
import { UserModule } from 'src/user/user.module';
import { GroupUserController } from './group-user.controller';

@Module({
  imports: [DatabaseModule, ProjectModule, forwardRef(() => UserModule)],

  controllers: [GroupController, GroupUserController],
  providers: [
    //group
    { useValue: Group, provide: 'GROUP_MODEL' },
    GroupRepository,
    GroupService,

    //group Members
    { useValue: GroupMember, provide: 'GROUP_MEMBER_MODEL' },
    GroupMemberRepository,
    GroupMembersService,
  ],
  exports: [GroupService, GroupMembersService],
})
export class GroupModule {}
