import { ApiProperty } from '@nestjs/swagger';

export class GroupDTO {
  @ApiProperty({
    description: 'The unique identifier of the group',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'The name of the group',
    example: 'My Group',
  })
  key: string;

  @ApiProperty({
    description: 'The project ID associated with the group',
    example: 123,
    required: false,
  })
  projectId?: number;

  @ApiProperty({
    description: 'The date and time when the group was created',
    example: '2024-12-16T12:34:56Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'The date and time when the group was last updated',
    example: '2024-12-17T15:30:00Z',
  })
  updatedAt: Date;
}
