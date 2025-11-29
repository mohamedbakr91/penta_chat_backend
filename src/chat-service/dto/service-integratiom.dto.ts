import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { GroupRole } from 'src/group/entities/group-member.entity';
export class ServiceIntegrationDTO {
  key: string;
  data: GroupData[];
}

export class GroupData {
  @ApiProperty({
    description: 'The name of the group',
    example: 'My Group',
  })
  @IsNotEmpty()
  @IsString()
  key: string;

  @ApiProperty({
    description: 'The project ID associated with the group',
    example: 123,
    required: false,
  })
  @IsNotEmpty()
  @IsNumber()
  projectId: number;

  users: UserIntegrationData[];
}

export class UserIntegrationData {
  id: number;
  userName: string;
  avatar?: string;
  firstName?: string;
  role: GroupRole;
  userSecretKey: string;
}
