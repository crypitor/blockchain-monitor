import { ProjectMemberRepository } from '@app/shared_modules/project/repositories/project.member.repository';
import { ProjectRepository } from '@app/shared_modules/project/repositories/project.repository';
import {
  Project,
  ProjectMember,
  ProjectRole,
  ProjectStatus,
} from '@app/shared_modules/project/schemas/project.schema';
import { shortUUID } from '@app/utils/uuidUtils';
import { HttpException, Injectable } from '@nestjs/common';
import { Builder } from 'builder-pattern';
import { User } from '../users/schemas/user.schema';
import { CreateProjectDto, ProjectResponseDto } from './dto/project.dto';

@Injectable()
export class ProjectService {
  constructor(
    private readonly projectRepository: ProjectRepository,
    private readonly projectMemberRepository: ProjectMemberRepository,
  ) {}

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

  async createProject(
    user: User,
    createProjectDto: CreateProjectDto,
  ): Promise<ProjectResponseDto> {
    const project = Builder<Project>()
      .projectId(shortUUID(16))
      .ownerId(user.userId)
      .name(createProjectDto.name)
      .status(ProjectStatus.ACTIVE)
      .maxMember(5)
      .memberCount(1)
      .maxMonitor(5)
      .monitorCount(0)
      .maxAddress(1000)
      .addressCount(0)
      .dateCreated(new Date())
      .build();

    const createdProject = await this.projectRepository.saveProject(project);
    const member = Builder<ProjectMember>()
      .projectId(createdProject.projectId)
      .userId(user.userId)
      .role(ProjectRole.OWNER)
      .build();
    await this.projectMemberRepository.save(member);
    return ProjectResponseDto.from(createdProject);
  }

  async listProjects(user: User): Promise<ProjectResponseDto[]> {
    const projects = await this.projectRepository.listUserProjects(user.userId);
    return projects.map((project) => ProjectResponseDto.from(project));
  }
}