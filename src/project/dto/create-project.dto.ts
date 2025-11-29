import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsBoolean, IsOptional } from 'class-validator';

export class CreateProjectDto {
  // @ApiProperty({
  //   description: 'The unique key of the project',
  //   example: 'mkpsaW1#',
  // })
  // @IsNotEmpty()
  // @IsString()
  key: string;

  @ApiProperty({
    description: 'The display name of the project',
    example: 'Internal CRM',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Optional logo URL or identifier',
    example: 'https://cdn.example.com/logo.png',
    required: false,
  })
  @IsOptional()
  @IsString()
  logo?: string;

  @ApiProperty({
    description: 'Optional description of the project',
    example: 'Project used to manage customer relationships.',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;
}
