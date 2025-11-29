import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import { GroupRole } from '../../entities/group-member.entity';

export class CreateGroupMemberDto {
  @ApiPropertyOptional({
    description: 'The ID of the group',
    example: 1,
  })
  @IsOptional()
  @IsNumber()
  groupId?: number;

  @ApiProperty({
    description: 'The ID of the user',
    example: 1,
  })
  @IsNotEmpty()
  @IsNumber()
  userId: number;

  @ApiProperty({
    description: 'Role of the user',
    enum: GroupRole,
    example: GroupRole.MEMBER,
  })
  @IsEnum(GroupRole)
  role: GroupRole;
}
