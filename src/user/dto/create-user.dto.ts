import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateUserDTO {
  @ApiProperty({
    description: "User's first name",
    example: 'Ahmed',
  })
  @IsString()
  @IsNotEmpty()
  firstName?: string;

  @ApiProperty({
    description: "User's last name",
    example: 'Mahmoud',
  })
  @IsString()
  @IsOptional()
  lastName?: string;

  @ApiProperty({ description: 'user Avatar', example: 'fileKey' })
  @IsOptional()
  @IsString()
  avatar?: string;

  @ApiProperty({
    description: 'Username chosen by the user',
    example: 'ahmed123',
  })
  @IsString()
  @IsNotEmpty()
  userName: string;

  @ApiProperty({
    description: 'The project ID associated with the group',
    example: 123,
    required: false,
  })
  @IsNotEmpty()
  @IsNumber()
  projectId: number;

  @ApiProperty({
    description: 'The secretKey of TheUser',
    example: 123,
    required: false,
  })
  @IsNotEmpty()
  @IsNumber()
  userSecretKey: string;

  @ApiProperty({
    description: 'The project ID of user in other system',
    example: 123,
    required: false,
  })
  @IsNotEmpty()
  @IsNumber()
  userProjectId: number;
}
