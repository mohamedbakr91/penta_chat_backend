import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { GroupMember } from './entities/group-member.entity';
import { GroupMembersController } from './group-members.controller';
import { GroupMembersService } from './group-members.service';
import { GroupMemberRepository } from './repositories/group-member.repository';

@Module({
  imports: [DatabaseModule],
  controllers: [GroupMembersController],
  providers: [
    { useValue: GroupMember, provide: 'GROUP_MEMBER_MODEL' },
    GroupMemberRepository,
    GroupMembersService,
  ],
  exports: [GroupMembersService],
})
export class GroupMembersModule {}
