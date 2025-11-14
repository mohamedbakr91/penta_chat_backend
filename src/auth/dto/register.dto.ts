import { ApiExtraModels, ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";

import { CreateUserDTO } from "src/user/dto/create-user.dto";
@ApiExtraModels(CreateUserDTO)
export class RegisterDTO extends CreateUserDTO {}

export class QuickRegisterDTO {
  @ApiProperty({
    description: "User's email address",
    example: "ahmed@example.com",
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ description: "user Avatar", example: "fileKey" })
  @IsNotEmpty()
  @IsString()
  avatar: string;

  @ApiProperty({
    description: "firstName chosen by the user",
    example: "ahmed123",
  })
  @IsString()
  @IsNotEmpty()
  firstName: string;
}
