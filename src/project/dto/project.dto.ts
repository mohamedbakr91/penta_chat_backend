import { ApiProperty } from '@nestjs/swagger';
import { ProjectStatus } from '../entities/project.entity';

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
    description: 'Display name of the project',
    example: 'Internal CRM',
  })
  name: string;

  @ApiProperty({
    description: 'Optional logo URL or identifier',
    example: 'https://cdn.example.com/logo.png',
    required: false,
  })
  logo?: string;

  @ApiProperty({
    description: 'Optional description of the project',
    example: 'Project used to manage customer relationships.',
    required: false,
  })
  description?: string;

  @ApiProperty({
    description: 'Current status of the project',
    enum: ProjectStatus,
    example: ProjectStatus.ACTIVE,
  })
  status: ProjectStatus;

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
