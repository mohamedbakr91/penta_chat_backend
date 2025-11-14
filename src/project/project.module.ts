import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { Project } from './entities/project.entity';
import { ProjectController } from './project.controller';
import { ProjectService } from './project.service';
import { ProjectRepository } from './repositories/project.repository';

@Module({
  imports: [DatabaseModule],
  controllers: [ProjectController],
  providers: [
    { useValue: Project, provide: 'PROJECT_MODEL' },
    ProjectRepository,
    ProjectService,
  ],
  exports: [ProjectService],
})
export class ProjectModule {}
