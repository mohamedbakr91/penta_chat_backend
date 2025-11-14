import { ApiProperty } from '@nestjs/swagger';

export class ProjectDTO {
  @ApiProperty({
    description: 'The unique identifier of the project',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'The unique key of the project',
    example: 'mkpsaW1#',
  })
  key: string;

  @ApiProperty({
    description: 'Integration status of the project',
    example: true,
  })
  integration: boolean;

  @ApiProperty({
    description: 'First data stored as JSON',
    example: { someKey: 'someValue' },
  })
  firstData: any;

  @ApiProperty({
    description: 'The date and time when the project was created',
    example: '2024-12-16T12:34:56Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'The date and time when the project was last updated',
    example: '2024-12-17T15:30:00Z',
  })
  updatedAt: Date;
}
