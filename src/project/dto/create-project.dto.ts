import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsBoolean, IsOptional } from 'class-validator';

export class CreateProjectDto {
  @ApiProperty({
    description: 'The unique key of the project',
    example: 'mkpsaW1#',
  })
  @IsNotEmpty()
  @IsString()
  key: string;

  @ApiProperty({
    description: 'Integration status of the project',
    example: false,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  integration?: boolean;

  @ApiProperty({
    description: 'First data stored as JSON',
    example: { someKey: 'someValue' },
    required: false,
  })
  @IsOptional()
  firstData?: any;
}
