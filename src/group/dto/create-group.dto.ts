import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class CreateGroupDto {
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
}
