import { ErrorCode } from '@app/global/global.error';
import { ProjectMemberRepository } from '@app/shared_modules/project/repositories/project.member.repository';
import { ProjectQuotaRepository } from '@app/shared_modules/project/repositories/project.quota.repository';
import { ProjectRepository } from '@app/shared_modules/project/repositories/project.repository';
import {
  Project,
  ProjectMember,
  ProjectQuota,
  ProjectRole,
  ProjectStatus,
} from '@app/shared_modules/project/schemas/project.schema';
import { generateProjectId } from '@app/utils/uuidUtils';
import { Injectable } from '@nestjs/common';
import { Builder } from 'builder-pattern';
import { User } from '../users/schemas/user.schema';
import {
  CreateProjectDto,
  ProjectQuotaResponseDto,
  ProjectResponseDto,
} from './dto/project.dto';
import { ApiKeyUser } from '../apikey/schemas/apikey.schema';

@Injectable()
export class ProjectService {
  constructor(
    private readonly projectRepository: ProjectRepository,
    private readonly projectMemberRepository: ProjectMemberRepository,
    private readonly projectQuotaRepository: ProjectQuotaRepository,
  ) {}

  async checkProjectPermission(
    user: User,
    projectId: string,
  ): Promise<ProjectMember> {
    if (user instanceof ApiKeyUser) {
      if (user.projectId !== projectId) {
        throw ErrorCode.PROJECT_FORBIDDEN.asException();
      }
    }
    const member = await this.projectMemberRepository.findByUserAndProject(
      user.userId,
      projectId,
    );
    if (!member) {
      throw ErrorCode.PROJECT_FORBIDDEN.asException();
    }
    return member;
  }

  async getProject(user: User, id: string): Promise<ProjectResponseDto> {
    const project = await this.projectRepository.findById(id);
    if (!project) {
      throw ErrorCode.PROJECT_NOT_FOUND.asException();
    }

    await this.checkProjectPermission(user, project.projectId);

    return ProjectResponseDto.from(project);
  }

  async createProject(
    user: User,
    createProjectDto: CreateProjectDto,
  ): Promise<ProjectResponseDto> {
    const project = Builder<Project>()
      .projectId(generateProjectId())
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
      .currentQuota(1000)
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

  async getProjectCurrentQuora(
    user: User,
    projectId: string,
  ): Promise<ProjectQuotaResponseDto> {
    const project = await this.projectRepository.findById(projectId);
    if (!project) {
      throw ErrorCode.PROJECT_NOT_FOUND.asException();
    }

    await this.checkProjectPermission(user, project.projectId);
    return this.projectQuotaRepository
      .getCurrentMonthQuota(projectId)
      .then((quota) => {
        if (quota) {
          return ProjectQuotaResponseDto.from(quota);
        } else {
          const date = new Date();
          const month =
            `${date.getMonth() + 1}`.padStart(2, '0') + `${date.getFullYear()}`;
          return ProjectQuotaResponseDto.from(
            Builder<ProjectQuota>()
              .projectId(project.projectId)
              .month(month)
              .ownerId(project.ownerId)
              .quota(project.currentQuota)
              .used(0)
              .dateCreated(date)
              .build(),
          );
        }
      });
  }
}
