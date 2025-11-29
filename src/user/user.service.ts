import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { Transaction } from 'sequelize';
import { AuthHelper } from 'src/auth/auth-helper.service';
import { IPaginatedResponse } from 'src/shared/interfaces';
import { CreateUserDTO } from './dto/create-user.dto';
import { FindAllUsersDTO } from './dto/list-users.dto';
import { UpdateUserDTO } from './dto/update-user.dto';
import { UserDTO } from './dto/user.dto';
import { UserRepository } from './repositories/user.repository';
import { GeneratorHelper } from 'src/shared/helpers/generator';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);
  constructor(
    @Inject(UserRepository) private readonly repository: UserRepository,
    private readonly authHelper: AuthHelper,
  ) {}

  async findOrCreate(
    data: CreateUserDTO,
    transaction?: Transaction,
  ): Promise<UserDTO | null> {
    if (!data.userName) {
      throw new BadRequestException('User name is required');
    }

    if (!data.projectId) {
      throw new BadRequestException(
        `Project ID is required for user: ${data.userName}`,
      );
    }

    const foundUserName = await this.repository.findByUsernameAndProject(
      data.userName,
      data.projectId,
      transaction,
    );

    if (foundUserName) return foundUserName;

    // Generate userSecretKey if not provided
    const userSecretKey =
      data.userSecretKey || GeneratorHelper.generateRandomAlphaNumeric(15);
    const user = await this.repository.create(
      { ...data, userSecretKey },
      transaction,
    );

    this.logger.log(`User created successfully: ${user.id}`);

    return user;
  }

  async findAll(
    queryData: FindAllUsersDTO,
  ): Promise<IPaginatedResponse<UserDTO>> {
    this.logger.log('Fetching all users with query');
    const users = await this.repository.findAllUsers(queryData);
    this.logger.log(`Fetched ${users.data.length} users`);
    return users;
  }

  async findOneById(id: number): Promise<UserDTO> {
    const user = await this.repository.findById(id);
    if (!user) throw new NotFoundException(`user with ${id} NotFound`);
    return user;
  }
  async findByUserName(username: string): Promise<UserDTO | null> {
    const user = await this.repository.findByUserName(username);
    return user;
  }

  // async findByUsernameAndProjectAndUserProjectId(
  //   username: string,
  //   projectId: number,
  //   userProjectId: number,
  // ): Promise<UserDTO | null> {
  //   const user = await this.repository.findByUsernameAndProjectAndUserProjectId(
  //     username,
  //     projectId,
  //     userProjectId,
  //   );
  //   return user;
  // }
  // async findOneByEmail(email: string): Promise<UserDTO> {
  //   const user = await this.repository.findByEmail(email);

  //   return user;
  // }

  async findByUserNameAndSecretKey(
    username: string,
    userSecretKey: string,
  ): Promise<UserDTO | null> {
    const user = await this.repository.findByUserNameAndSecretKey(
      username,
      userSecretKey,
    );
    return user;
  }

  async update(
    id: number,
    data: UpdateUserDTO,
    transaction?: Transaction,
  ): Promise<UserDTO> {
    const user = await this.repository.findById(id);
    if (!user) throw new NotFoundException(`user with ${id} NotFound`);
    return await this.repository.updateUser(id, data, transaction);
  }

  async remove(id: number, transaction?: Transaction): Promise<void> {
    const user = await this.repository.findById(id);
    if (!user) throw new NotFoundException(`user with ${id} NotFound`);
    await this.repository.deleteUser(id, transaction);
  }
}
