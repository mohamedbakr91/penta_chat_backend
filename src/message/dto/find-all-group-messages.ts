import { ApiProperty } from '@nestjs/swagger';
import { PaginatedDTO } from 'src/shared/dto';

export class FindAllGroupMessagesDTO extends PaginatedDTO {
  //   userId: number;

  @ApiProperty({
    description: 'groupId',
  })
  groupId: number;
}
