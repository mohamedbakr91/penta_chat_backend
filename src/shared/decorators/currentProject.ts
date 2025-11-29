import {
  BadRequestException,
  createParamDecorator,
  ExecutionContext,
} from '@nestjs/common';

export const CurrentProject = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const project = request.project;

    if (!project) {
      throw new BadRequestException(
        'Project context is missing. Make sure ProjectGuard is applied and x-project-key header is provided.',
      );
    }

    if (!project.id) {
      throw new BadRequestException(
        'Project context is invalid. Project ID is missing.',
      );
    }

    return project;
  },
);
