import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { Group } from './entities/group.entity';
import { GroupController } from './group.controller';
import { GroupService } from './group.service';
import { GroupRepository } from './repositories/group.repository';
import { GroupMembersModule } from 'src/group-members/group-members.module';

@Module({
  imports: [DatabaseModule, GroupMembersModule],

  controllers: [GroupController],
  providers: [
    { useValue: Group, provide: 'GROUP_MODEL' },
    GroupRepository,
    GroupService,
  ],
  exports: [GroupService],
})
export class GroupModule {}
