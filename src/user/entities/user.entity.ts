import {
  AutoIncrement,
  Column,
  CreatedAt,
  ForeignKey,
  HasMany,
  Model,
  PrimaryKey,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';
import { Friendship } from 'src/friendship/entities/friendship.entity';
import { Project } from 'src/project/entities/project.entity';

@Table({ tableName: 'users', timestamps: true })
export class User extends Model<User> {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @ForeignKey(() => Project)
  @Column
  projectId: number;

  @Column
  firstName: string;

  @Column
  lastName: string;

  @Column
  avatar: string;

  @Column
  userName: string;

  @Column
  userSecretKey: string;

  @Column
  userProjectId: number;

  // user id in other system

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;

  @HasMany(() => Friendship, { foreignKey: 'userId1', as: 'friendsAsUser1' })
  friendshipsAsUser1: Friendship[];

  @HasMany(() => Friendship, { foreignKey: 'userId2', as: 'friendsAsUser2' })
  friendshipsAsUser2: Friendship[];

  // @HasMany(() => TopicUser, { foreignKey: "creatorId", as: "topics" })
  // topicUser: TopicDTO[];
}

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user ',
}
