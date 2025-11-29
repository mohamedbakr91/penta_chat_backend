import { ApiProperty } from '@nestjs/swagger';
import { ArrayMinSize, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { GroupRole } from '../../entities/group-member.entity';

export class AddGroupMemberUserDto {
  @ApiProperty({
    description: "User's first name",
    example: 'Ahmed',
    required: false,
  })
  @IsOptional()
  @IsString()
  firstName?: string;

  @ApiProperty({
    description: "User's last name",
    example: 'Mahmoud',
    required: false,
  })
  @IsOptional()
  @IsString()
  lastName?: string;

  @ApiProperty({
    description: 'user Avatar',
    example: 'fileKey',
    required: false,
  })
  @IsOptional()
  @IsString()
  avatar?: string;

  @ApiProperty({
    description: 'Username chosen by the user',
    example: 'ahmed123',
  })
  @IsNotEmpty()
  @IsString()
  userName: string;

  @ApiProperty({
    description: 'The project ID of user in other system',
    example: 123,
  })
  @IsNotEmpty()
  @IsNumber()
  userProjectId: number;

  @ApiProperty({
    description:
      'The secretKey of TheUser (optional, will be generated if not provided)',
    example: 'abc123xyz',
    required: false,
  })
  @IsOptional()
  @IsString()
  userSecretKey?: string;

  @ApiProperty({
    description: 'Role of the user in the group',
    enum: GroupRole,
    example: GroupRole.MEMBER,
  })
  @IsNotEmpty()
  @IsEnum(GroupRole)
  role: GroupRole;
}

export class AddGroupMembersDto {
  @ApiProperty({
    type: [AddGroupMemberUserDto],
    description: 'Members to be added to the group (user data + role)',
  })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => AddGroupMemberUserDto)
  members: AddGroupMemberUserDto[];
}
