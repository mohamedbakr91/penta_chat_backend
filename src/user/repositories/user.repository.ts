import { Inject, Injectable } from '@nestjs/common';
import { Transaction } from 'sequelize';
import { IPaginatedResponse } from 'src/shared/interfaces';
import { Pagination } from 'src/shared/pagination';
import { CreateUserDTO } from '../dto/create-user.dto';
import { FindAllUsersDTO } from '../dto/list-users.dto';
import { UpdateUserDTO } from '../dto/update-user.dto';
import { UserDTO } from '../dto/user.dto';
import { User } from '../entities/user.entity';

@Injectable()
export class UserRepository {
  constructor(@Inject('USER_MODEL') private model: typeof User) {}

  async create(
    createUserDTO: Partial<CreateUserDTO>,
    transaction?: Transaction,
  ): Promise<UserDTO> {
    return (await this.model.create(createUserDTO, { transaction })).toJSON();
  }

  async findAllUsers({
    page,
    limit,
  }: FindAllUsersDTO): Promise<IPaginatedResponse<UserDTO>> {
    const paginate = new Pagination(page, limit);

    const { rows: data, count } = await this.model.findAndCountAll({
      limit: paginate.getLimit(),
      offset: paginate.getOffset(),
      where: {},
    });

    return {
      data: data.map((item) => item.toJSON()),
      meta: paginate.getMetaData(data.length),
    };
  }

  async findById(id: number): Promise<UserDTO | null> {
    const user = await this.model.findByPk(id);

    return user ? user.toJSON() : null;
  }
  async findByUsernameAndProject(
    userName: string,
    projectId: number,
  ): Promise<UserDTO | null> {
    const user = await this.model.findOne({
      where: { userName, projectId },
    });

    return user ? user.toJSON() : null;
  }

  async findByUserNameAndSecretKey(
    userName: string,
    userSecretKey: string,
  ): Promise<UserDTO | null> {
    const user = await this.model.findOne({
      where: { userName, userSecretKey },
    });

    return user ? user.toJSON() : null;
  }
  // async findByEmail(email: string): Promise<UserDTO | null> {
  //   const user = await this.model.findOne({
  //     where: { email },
  //   });
  //   return user ? user?.toJSON() : null;
  // }

  async findByUserName(userName: string): Promise<UserDTO | null> {
    return (
      (
        await this.model.findOne({
          where: { userName },
        })
      )?.toJSON() || null
    );
  }

  async updateUser(
    id: number,
    data: UpdateUserDTO,
    transaction: Transaction,
  ): Promise<UserDTO | null> {
    const user = await this.model.findByPk(id);
    user.update(data, { transaction });
    return user ? user?.toJSON() : null;
  }

  async deleteUser(id: number, transaction?: Transaction): Promise<void> {
    await this.model.destroy({ where: { id }, transaction });
  }
}
