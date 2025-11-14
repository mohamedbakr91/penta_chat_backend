import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { ClsService } from "nestjs-cls";
import { AuthHelper } from "../auth-helper.service";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly authHelper: AuthHelper,
    private readonly clsService: ClsService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const authHeader = request.headers.authorization;

    if (!authHeader) {
      throw new UnauthorizedException("Missing authorization header");
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      throw new UnauthorizedException("Missing token");
    }

    try {
      const user = await this.authHelper.verifyAuthJWTToken(token);

      request.user = user;
      this.clsService.set("user", user);

      return true;
    } catch (err) {
      throw new UnauthorizedException("Invalid token");
    }
  }
}
