import {
  AutoIncrement,
  Column,
  CreatedAt,
  Model,
  PrimaryKey,
  Table,
  UpdatedAt,
  HasMany,
  DataType,
} from 'sequelize-typescript';
import { Group } from 'src/group/entities/group.entity';

export enum ProjectStatus {
  ACTIVE = 'active',
  PAUSED = 'paused',
  ARCHIVED = 'archived',
  DELETED = 'deleted',
}

@Table({ tableName: 'projects', timestamps: true })
export class Project extends Model<Project> {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @Column({ unique: true })
  key: string;

  @Column
  name: string;

  @Column({ allowNull: true })
  logo?: string;

  @Column({ allowNull: true })
  description?: string;

  @Column({
    type: DataType.ENUM(...Object.values(ProjectStatus)),
    allowNull: false,
    defaultValue: ProjectStatus.ACTIVE,
  })
  status: ProjectStatus;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;

  @HasMany(() => Group, 'projectId')
  groups: Group[];
}
