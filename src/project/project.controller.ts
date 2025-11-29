import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  UseGuards,
  ValidationPipe,
  UsePipes,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ProjectService } from './project.service';
import { UpdateProjectDto } from './dto/update-project.dto';
import { ProjectDTO } from './dto/project.dto';
import { AuthGuard } from 'src/auth/guards/jwt.guard';
@ApiTags('Project Controller')
@Controller('project')
@Controller('group')
@ApiBearerAuth('JWT')
@UseGuards(AuthGuard)
@UsePipes(new ValidationPipe({ transform: true }))
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Get(':id')
  @ApiOperation({ summary: 'Get a single project by id' })
  @ApiResponse({ type: ProjectDTO })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<ProjectDTO> {
    return await this.projectService.findOne(id);
  }

  // @Get(':id/is-integrated')
  // isIntegrated(@Param('id') id: string) {
  //   return this.projectService.isIntegrated(+id);
  // }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProjectDto: UpdateProjectDto) {
    return this.projectService.update(+id, updateProjectDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.projectService.remove(+id);
  }
}
