import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ProjectService } from 'src/project/project.service';
import { ProjectStatus } from 'src/project/entities/project.entity';

@Injectable()
export class ProjectGuard implements CanActivate {
  constructor(private readonly projectService: ProjectService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const projectIdSource =
      request.user?.projectId ??
      request.params?.projectId ??
      request.query?.projectId ??
      request.body?.projectId;

    const headerProjectKey =
      request.headers?.['x-project-key'] ?? request.headers?.['X-Project-Key'];

    const projectKey =
      (typeof headerProjectKey === 'string'
        ? headerProjectKey
        : Array.isArray(headerProjectKey)
          ? headerProjectKey[0]
          : undefined) ??
      request.params?.projectKey ??
      request.query?.projectKey ??
      request.body?.projectKey;

    if (!projectIdSource && !projectKey) {
      throw new ForbiddenException('Project context is missing');
    }

    let project: any = null;

    try {
      if (projectKey !== undefined && projectKey !== null && projectKey !== '') {
        project = await this.projectService.findOneByKey(String(projectKey));
      }
    } catch (error) {
      // Project not found by key, try by ID
      project = null;
    }

    if (!project) {
      const parsedProjectId =
        typeof projectIdSource === 'string'
          ? parseInt(projectIdSource, 10)
          : projectIdSource;

      if (!parsedProjectId || Number.isNaN(parsedProjectId)) {
        throw new ForbiddenException('Project identifier is invalid');
      }

      try {
        project = await this.projectService.findOne(parsedProjectId);
      } catch (error) {
        throw new NotFoundException('Project not found');
      }
    }

    if (!project || !project.id) {
      throw new NotFoundException('Project not found or invalid');
    }

    if (
      project.status === ProjectStatus.DELETED ||
      project.status === ProjectStatus.ARCHIVED
    ) {
      throw new ForbiddenException(
        `Project is ${project.status} and cannot access this resource`,
      );
    }

    request.project = project;

    return true;
  }
}
