import { Module } from '@nestjs/common';
import { User } from './entities/user.entity';
import { UserMapper } from './mappers/user.mapper';
import { UserRepository } from './repositories/user.repository';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [UserController],
  providers: [
    { useValue: User, provide: 'USER_MODEL' },
    UserService,
    UserRepository,
    UserMapper,
  ],
  exports: [UserService, UserMapper],
})
export class UserModule {}
