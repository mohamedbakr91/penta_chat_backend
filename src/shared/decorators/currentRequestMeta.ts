import { createParamDecorator, ExecutionContext } from "@nestjs/common";

export const CurrentRequestMeta = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  return request.meta;
});
