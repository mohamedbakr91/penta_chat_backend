import {
  Table,
  Column,
  Model,
  PrimaryKey,
  AutoIncrement,
  CreatedAt,
  UpdatedAt,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { User } from 'src/user/entities/user.entity';
import { Group } from 'src/group/entities/group.entity';
import { Project } from 'src/project/entities/project.entity';

export enum AttachmentType {
  IMAGE = 'image',
  VIDEO = 'video',
  FILE = 'file',
}

@Table({ tableName: 'messages', timestamps: true })
export class Message extends Model<Message> {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @ForeignKey(() => Project)
  @Column({ allowNull: true })
  projectId?: number;
  @ForeignKey(() => User)
  @Column
  senderId: number;

  @ForeignKey(() => User)
  @Column({ allowNull: true })
  recipientId: number;

  @ForeignKey(() => Group)
  @Column({ allowNull: true })
  groupId: number;

  @Column({ allowNull: true })
  content: string;

  @Column({
    type: 'ENUM',
    values: Object.values(AttachmentType),
    allowNull: true,
  })
  attachmentType: AttachmentType;

  @Column({ allowNull: true })
  attachmentKey: string;

  @BelongsTo(() => Project, 'projectId')
  @BelongsTo(() => Group, 'groupId')
  group: Group;

  @BelongsTo(() => User, 'senderId')
  sender: User;

  @BelongsTo(() => User, 'recipientId')
  recipient?: User;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;
}
