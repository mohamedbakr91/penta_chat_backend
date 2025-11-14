import { ApiProperty } from '@nestjs/swagger';

export class UserDTO {
  @ApiProperty({
    description: 'Unique identifier for the user',
  })
  id: number;

  @ApiProperty({
    description: "User's first name",
  })
  firstName: string;

  @ApiProperty({
    description: "User's last name",
    example: 'Mahmoud',
  })
  lastName: string;

  @ApiProperty({
    description: "URL of the user's avatar",
    example: 'https://example.com/avatar.png',
    required: false,
  })
  avatar: string;

  @ApiProperty({
    description: 'The secretKey of TheUser',
    example: 123,
    required: false,
  })
  userSecretKey: string;

  @ApiProperty({
    description: 'Username chosen by the user',
    example: 'ahmed123',
  })
  userName: string;

  @ApiProperty({
    description: 'The project ID associated with the group',
    example: 123,
    required: false,
  })
  projectId: number;
  @ApiProperty({
    description: 'The project ID of user in other system',
    example: 123,
    required: false,
  })
  userProjectId: number;

  @ApiProperty({
    description: 'Date when the user was created',
    example: '2024-12-11T00:00:00Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Date when the user was last updated',
    example: '2024-12-11T00:00:00Z',
  })
  updatedAt: Date;
}
