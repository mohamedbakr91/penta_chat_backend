import {
  AutoIncrement,
  BelongsTo,
  Column,
  CreatedAt,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';
import { Group } from 'src/group/entities/group.entity';
import { Message } from 'src/message/entities/message.entity';
import { User } from 'src/user/entities/user.entity';

@Table({ tableName: 'group_members', timestamps: true })
export class GroupMember extends Model<GroupMember> {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @ForeignKey(() => Group)
  @Column
  groupId: number;

  @ForeignKey(() => User)
  @Column
  userId: number;

  @Column
  role: GroupRole;

  @ForeignKey(() => Message)
  lastSeenMessageId: number;

  @Column({ allowNull: true })
  lastSeenAt: Date;
  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;

  @BelongsTo(() => Group)
  group: Group;

  @BelongsTo(() => User)
  user: User;
}
export enum GroupRole {
  ADMIN = 'admin',
  MEMBER = 'member',
}
