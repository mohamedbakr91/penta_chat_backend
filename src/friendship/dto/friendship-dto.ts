import { ApiProperty } from '@nestjs/swagger';
import { FriendshipStatus } from '../entities/friendship.entity';

export class FriendshipDTO {
  @ApiProperty({
    description: 'The unique identifier of the friendship',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'The ID of the first user in the friendship',
    example: 101,
  })
  userId1: number;

  @ApiProperty({
    description: 'The ID of the second user in the friendship',
    example: 202,
  })
  userId2: number;

  @ApiProperty({
    description:
      'The status of the friendship (e.g., pending, accepted, blocked)',
    example: 'pending',
    enum: FriendshipStatus,
  })
  status: FriendshipStatus;

  @ApiProperty({
    description: 'The ID of the user who initiated the friendship',
    example: 101,
  })
  initUserId: number;

  @ApiProperty({
    description: 'The date and time when the friendship was created',
    example: '2024-12-16T12:34:56Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'The date and time when the friendship was last updated',
    example: '2024-12-17T15:30:00Z',
  })
  updatedAt: Date;
}
