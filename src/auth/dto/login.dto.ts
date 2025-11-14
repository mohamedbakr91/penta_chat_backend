import { IsNotEmpty, IsString, IsOptional, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDTO {
  @ApiProperty({
    description: 'Key of the project the user belongs to',
    example: 'project_123',
  })
  @IsNotEmpty()
  @IsString()
  projectKey: string;

  @ApiProperty({
    description: 'Username of the user',
    example: 'john.doe',
  })
  @IsNotEmpty()
  @IsString()
  userName: string;

  @ApiProperty({
    description: 'Secret key provided for external login',
    example: 'abc123xyz',
  })
  @IsNotEmpty()
  @IsString()
  userSecretKey: string;

  @ApiProperty({
    description: 'Optional user ID for verification',
    example: 42,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  id?: number;
}
