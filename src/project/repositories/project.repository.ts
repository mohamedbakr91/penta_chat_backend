import { Inject, Injectable } from '@nestjs/common';
import { Transaction } from 'sequelize';
import { IPaginatedResponse } from 'src/shared/interfaces';
import { Pagination } from 'src/shared/pagination';
import { CreateProjectDto } from '../dto/create-project.dto';
import { UpdateProjectDto } from '../dto/update-project.dto';
import { ProjectDTO } from '../dto/project.dto';
import { Project } from '../entities/project.entity';

@Injectable()
export class ProjectRepository {
  constructor(@Inject('PROJECT_MODEL') private model: typeof Project) {}

  async create(
    data: Partial<CreateProjectDto>,
    transaction?: Transaction,
  ): Promise<ProjectDTO> {
    return (await this.model.create(data, { transaction })).toJSON();
  }

  async findAll(
    page: number = 1,
    limit: number = 10,
  ): Promise<IPaginatedResponse<ProjectDTO>> {
    const paginate = new Pagination(page, limit);

    const { rows: data, count } = await this.model.findAndCountAll({
      limit: paginate.getLimit(),
      offset: paginate.getOffset(),
    });

    return {
      data: data.map((item) => item.toJSON()),
      meta: paginate.getMetaData(count),
    };
  }

  async findOne(
    id: number,
    transaction?: Transaction,
  ): Promise<ProjectDTO | null> {
    const project = await this.model.findByPk(id, { transaction });
    return project ? project.toJSON() : null;
  }
  async findOneByKey(key: string): Promise<ProjectDTO | null> {
    const project = await this.model.findOne({ where: { key } });
    return project ? project.toJSON() : null;
  }

  async findByKey(key: string): Promise<ProjectDTO | null> {
    const project = await this.model.findOne({ where: { key } });
    return project ? project.toJSON() : null;
  }

  async update(
    id: number,
    data: UpdateProjectDto,
    transaction?: Transaction,
  ): Promise<ProjectDTO | null> {
    const project = await this.model.findByPk(id);
    if (project) {
      await project.update(data, { transaction });
      return project.toJSON();
    }
    return null;
  }

  async delete(id: number, transaction?: Transaction): Promise<void> {
    await this.model.destroy({ where: { id }, transaction });
  }
}
