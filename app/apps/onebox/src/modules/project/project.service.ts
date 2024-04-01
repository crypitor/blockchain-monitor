import { ProjectRepository } from '@app/shared_modules/project/project.model.repository';
import {
  Project,
  ProjectStatus,
} from '@app/shared_modules/project/schemas/project.schema';
import { HttpException, Injectable } from '@nestjs/common';
import { Builder } from 'builder-pattern';
import { v4 as uuidv4 } from 'uuid';
import { User } from '../users/schemas/user.schema';
import { CreateProjectDto, ProjectResponseDto } from './dto/project.dto';

@Injectable()
export class ProjectService {
  constructor(private readonly projectRepository: ProjectRepository) {}

  async getProject(user: User, id: string): Promise<ProjectResponseDto> {
    const project = await this.projectRepository.findById(id);
    if (!project) {
      throw new HttpException('Project not found', 404);
    }

    if (project.ownerId !== user.userId) {
      throw new HttpException('Project not found', 404);
    }

    return ProjectResponseDto.from(project);
  }
}
