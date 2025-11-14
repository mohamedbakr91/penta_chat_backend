import {
  AutoIncrement,
  BelongsTo,
  Column,
  CreatedAt,
  DataType,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';
import { User } from 'src/user/entities/user.entity';

export enum FriendshipStatus {
  pending = 'pending',
  accepted = 'accepted',
  blocked = 'blocked',
}

@Table({
  tableName: 'friendships',
  timestamps: true,
  indexes: [
    {
      unique: true,
      fields: ['userId1', 'userId2'],
    },
  ],
})
export class Friendship extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @ForeignKey(() => User)
  @Column
  userId1: number;

  @ForeignKey(() => User)
  @Column
  userId2: number;

  @Column({
    type: DataType.STRING,
    defaultValue: FriendshipStatus.pending,
  })
  status: FriendshipStatus;

  @Column
  initUserId: number;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;

  @BelongsTo(() => User, 'userId1')
  user1: User;

  @BelongsTo(() => User, 'userId2')
  user2: User;
}
