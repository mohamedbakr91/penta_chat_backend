import { forwardRef, Global, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthHelper } from './auth-helper.service';
import { UserModule } from 'src/user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { DatabaseModule } from 'src/database/database.module';
import { ProjectModule } from 'src/project/project.module';
import { GroupModule } from 'src/group/group.module';
import { AuthGuard } from './guards/jwt.guard';
import { RolesGuard } from './guards/roles.guard';
import { ProjectGuard } from './guards/project.guard';
import { AuthController } from './auth.controller';

@Global()
@Module({
  imports: [
    forwardRef(() => UserModule),
    JwtModule.register({ secret: '$up3r$3cr#wefa$wetA@3t' }),
    DatabaseModule,
    ProjectModule,
    GroupModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, AuthHelper, AuthGuard, RolesGuard, ProjectGuard],
  exports: [AuthService, AuthHelper, AuthGuard, RolesGuard, ProjectGuard],
})
export class AuthModule {}
