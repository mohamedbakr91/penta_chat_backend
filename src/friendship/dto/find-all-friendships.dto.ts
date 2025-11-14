import { ApiProperty } from '@nestjs/swagger';
import { PaginatedDTO } from 'src/shared/dto';
import { FriendshipStatus } from '../entities/friendship.entity';

export class FindMyFriendshipsDTO extends PaginatedDTO {
  userId: number;

  @ApiProperty({
    enum: FriendshipStatus,
    enumName: 'FriendshipStatus', // اسم Enum للتوثيق في Swagger
    description: 'List my friendships',
  })
  status: FriendshipStatus;
}
