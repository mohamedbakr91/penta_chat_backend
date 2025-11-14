import { ApiProperty } from '@nestjs/swagger';
import { UserDTO } from 'src/user/dto/user.dto';

export class LoginResponseDTO {
  @ApiProperty({
    type: 'string',
    example: 'Auth Token',
    description: 'Api Auth Token',
  })
  authToken: string;

  @ApiProperty({ type: UserDTO, description: 'User' })
  user: UserDTO;
}
