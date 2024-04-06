import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Request } from 'express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { User } from '../users/schemas/user.schema';
import { CreateProjectDto, ProjectResponseDto } from './dto/project.dto';
import { ProjectService } from './project.service';

@ApiTags('Project')
@Controller('project')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @ApiOperation({ summary: 'Get project by id' })
  @ApiBearerAuth('JWT')
  @UseGuards(JwtAuthGuard)
  @Get('/:id')
  @ApiOkResponse({ type: ProjectResponseDto })
  async getProject(
    @Req() req: Request,
    @Param('id') projectId: string,
  ): Promise<ProjectResponseDto> {
    return await this.projectService.getProject(req.user as User, projectId);
  }

  @ApiOperation({ summary: 'List projects' })
  @ApiBearerAuth('JWT')
  @UseGuards(JwtAuthGuard)
  @Get('')
  @ApiOkResponse({ type: [ProjectResponseDto] })
  async getProjects(@Req() req: Request): Promise<ProjectResponseDto[]> {
    return await this.projectService.listProjects(req.user as User);
  }

  @ApiOperation({ summary: 'Create project' })
  @ApiBearerAuth('JWT')
  @UseGuards(JwtAuthGuard)
  @Post('')
  @ApiCreatedResponse({ type: ProjectResponseDto })
  async createProject(
    @Req() req: Request,
    @Body() body: CreateProjectDto,
  ): Promise<ProjectResponseDto> {
    return await this.projectService.createProject(req.user as User, body);
  }
}
