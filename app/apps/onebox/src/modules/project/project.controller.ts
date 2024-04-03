import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
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

  @ApiBearerAuth('JWT')
  @UseGuards(JwtAuthGuard)
  @Get('')
  @ApiOkResponse({ type: ProjectResponseDto })
  async getProject(
    @Req() req: Request,
    @Query('id') projectId: string,
  ): Promise<ProjectResponseDto> {
    return await this.projectService.getProject(req.user as User, projectId);
  }

  @ApiBearerAuth('JWT')
  @UseGuards(JwtAuthGuard)
  @Get('list')
  @ApiOkResponse({ type: [ProjectResponseDto] })
  async getProjects(@Req() req: Request): Promise<ProjectResponseDto[]> {
    return await this.projectService.listProjects(req.user as User);
  }

  @ApiBearerAuth('JWT')
  @UseGuards(JwtAuthGuard)
  @Post('create')
  @ApiCreatedResponse({ type: ProjectResponseDto })
  async createProject(
    @Req() req: Request,
    @Body() body: CreateProjectDto,
  ): Promise<ProjectResponseDto> {
    return await this.projectService.createProject(req.user as User, body);
  }
}
