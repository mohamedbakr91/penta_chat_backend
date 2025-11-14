import {
  AutoIncrement,
  Column,
  CreatedAt,
  Model,
  PrimaryKey,
  Table,
  UpdatedAt,
  HasMany,
  ForeignKey,
} from 'sequelize-typescript';
import { GroupMember } from 'src/group-members/entities/group-member.entity';
import { Project } from 'src/project/entities/project.entity';

@Table({ tableName: 'groups', timestamps: true })
export class Group extends Model<Group> {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @Column({ unique: true })
  key: string;

  @ForeignKey(() => Project)
  @Column
  projectId: number;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;

  @HasMany(() => GroupMember, 'groupId')
  members: GroupMember[];
}
