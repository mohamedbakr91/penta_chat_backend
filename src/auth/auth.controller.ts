// import { Body, Controller, Post, UsePipes, ValidationPipe } from "@nestjs/common";
// import { ApiResponse, ApiTags } from "@nestjs/swagger";
// import { UserDTO } from "src/user/dto/user.dto";
// import { UserMapper } from "src/user/mappers/user.mapper";
// import { AuthService } from "./auth.service";
// import { LoginDTO } from "./dto/login.dto";
// import { QuickRegisterDTO, RegisterDTO } from "./dto/register.dto";
// import { LoginResponseDTO } from "./response/login-response";

// @Controller("auth")
// @ApiTags("Authentication Controller")
// @UsePipes(new ValidationPipe({ transform: true }))
// export class AuthController {
//   constructor(
//     private readonly authService: AuthService,
//     private readonly userMapper: UserMapper,
//   ) {}

//   @ApiResponse({
//     type: LoginResponseDTO,
//   })
//   @Post("login")
//   async login(@Body() data: LoginDTO) {
//     const res = await this.authService.login(data);

//     res.user = await this.userMapper.mapSingle(res.user);

//     return res;
//   }

//   @ApiResponse({
//     type: UserDTO,
//   })
//   @Post("register")
//   async register(@Body() data: RegisterDTO): Promise<UserDTO> {
//     const user = await this.authService.register(data);

//     return user;
//   }

//   @ApiResponse({
//     type: LoginResponseDTO,
//   })
//   @Post("quick-register")
//   async quickRegister(@Body() data: QuickRegisterDTO) {
//     const user = await this.authService.quickRegister(data);

//     return user;
//   }
// }
