import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsEmail, IsOptional, IsPhoneNumber, IsString } from "class-validator";

export class UpdateUserDTO {
  @ApiPropertyOptional({
    description: "User's first name",
    example: "Ahmed",
  })
  @IsString()
  @IsOptional()
  firstName?: string;

  @ApiPropertyOptional({
    description: "User's last name",
    example: "Mahmoud",
  })
  @IsString()
  @IsOptional()
  lastName?: string;

  @ApiPropertyOptional({
    description: "User's email address",
    example: "ahmed@example.com",
  })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiPropertyOptional({ description: "Phone number of the user.", example: "+201066150500" })
  @IsPhoneNumber()
  @IsOptional()
  phone?: string;

  @ApiPropertyOptional({
    description: "URL of the user's avatar",
    example: "https://example.com/avatar.png",
    required: false,
  })
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  avatar?: string;

  @ApiPropertyOptional({
    description: "Username chosen by the user",
    example: "ahmed123",
  })
  @IsString()
  @IsOptional()
  userName?: string;
}
