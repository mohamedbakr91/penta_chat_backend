import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { IPaginatedResponse } from 'src/shared/interfaces';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { ProjectRepository } from './repositories/project.repository';
import { ProjectDTO } from './dto/project.dto';
import { Transaction } from 'sequelize';
import { GeneratorHelper } from 'src/shared/helpers/generator';
@Injectable()
export class ProjectService {
  private readonly logger = new Logger(ProjectService.name);

  constructor(
    @Inject(ProjectRepository)
    private readonly repository: ProjectRepository,
  ) {}

  async create(createProjectDto: CreateProjectDto): Promise<ProjectDTO> {
    try {
      const projectKey = GeneratorHelper.generateRandomAlphaNumeric(8);

      const project = await this.repository.create({
        ...createProjectDto,
        key: projectKey,
      });
      this.logger.log(`Project created: ${project.id}`);
      return project;
    } catch (error) {
      this.logger.error(
        `Error creating project: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async findAll(
    page: number = 1,
    limit: number = 10,
  ): Promise<IPaginatedResponse<ProjectDTO>> {
    return await this.repository.findAll(page, limit);
  }

  async findOne(id: number): Promise<ProjectDTO> {
    const project = await this.repository.findOne(id);
    if (!project) {
      throw new BadRequestException(`Project with id ${id} not found`);
    }
    return project;
  }

  async findOneByKey(key: string): Promise<ProjectDTO> {
    const project = await this.repository.findOneByKey(key);
    if (!project) {
      throw new BadRequestException(`Project with key ${key} not found`);
    }
    return project;
  }

  async update(
    id: number,
    updateProjectDto: UpdateProjectDto,
    transaction?: Transaction,
  ): Promise<ProjectDTO> {
    const project = await this.repository.findOne(id, transaction);
    if (!project) {
      throw new BadRequestException(`Project with id ${id} not found`);
    }

    const updatedProject = await this.repository.update(
      id,
      updateProjectDto,
      transaction,
    );
    if (!updatedProject) {
      throw new BadRequestException(`Failed to update project with id ${id}`);
    }

    return updatedProject;
  }

  async remove(id: number): Promise<void> {
    const project = await this.repository.findOne(id);
    if (!project) {
      throw new BadRequestException(`Project with id ${id} not found`);
    }

    await this.repository.delete(id);
  }
}
