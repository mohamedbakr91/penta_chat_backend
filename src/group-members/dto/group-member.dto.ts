import { ApiProperty } from '@nestjs/swagger';
import { GroupRole } from '../entities/group-member.entity';
import { BelongsTo } from 'sequelize-typescript';
import { Group } from 'src/group/entities/group.entity';
import { User } from 'src/user/entities/user.entity';

export class GroupMemberDTO {
  @ApiProperty({
    description: 'The unique identifier of the group member',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'The ID of the group',
    example: 1,
  })
  groupId: number;

  @ApiProperty({
    description: 'The ID of the user',
    example: 1,
  })
  userId: number;

  @ApiProperty({
    description: 'Role of the user',
    enum: GroupRole,
    example: GroupRole.MEMBER,
  })
  role: GroupRole;

  @ApiProperty({
    description: 'The date and time when the group member was created',
    example: '2024-12-16T12:34:56Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'The date and time when the group member was last updated',
    example: '2024-12-17T15:30:00Z',
  })
  updatedAt: Date;
  @BelongsTo(() => Group)
  group: Group;

  @BelongsTo(() => User)
  user: User;
}
