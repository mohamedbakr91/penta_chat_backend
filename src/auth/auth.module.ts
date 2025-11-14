import { forwardRef, Global, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthHelper } from './auth-helper.service';
import { UserModule } from 'src/user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { DatabaseModule } from 'src/database/database.module';
import { ProjectModule } from 'src/project/project.module';
import { GroupModule } from 'src/group/group.module';
import { GroupMembersModule } from 'src/group-members/group-members.module';

@Global()
@Module({
  imports: [
    forwardRef(() => UserModule),
    JwtModule.register({ secret: '$up3r$3cr#wefa$wetA@3t' }),
    DatabaseModule,
    ProjectModule,
    GroupMembersModule,
  ],
  controllers: [],
  providers: [AuthService, AuthHelper],
  exports: [AuthService, AuthHelper],
})
export class AuthModule {}
