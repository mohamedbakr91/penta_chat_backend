import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { CreateGroupMemberDto } from './create-group-member.dto';

export class UpdateGroupMemberDto extends PartialType(CreateGroupMemberDto) {
  @ApiPropertyOptional({
    description:
      'The date and time when the user last saw messages in the group',
    example: '2024-12-18T10:20:30Z',
  })
  lastSeenAt?: Date;

  @ApiProperty({
    description: 'The ID of the last seen message',
    example: 42,
  })
  lastSeenMessageId: number;
}
