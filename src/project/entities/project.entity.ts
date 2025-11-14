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

@Table({ tableName: 'projects', timestamps: true })
export class Project extends Model<Project> {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @Column({ unique: true })
  key: string;

  @Column
  integration: boolean;

  @Column(DataType.JSON)
  firstData: any;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;

  @HasMany(() => Group, 'projectId')
  groups: Group[];
}
