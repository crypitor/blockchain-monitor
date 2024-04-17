import { Injectable } from '@nestjs/common';
import { ProjectQuotaRepository } from '../repositories/project.quota.repository';
import { ProjectRepository } from '../repositories/project.repository';
import { ProjectQuota } from '../schemas/project.schema';

@Injectable()
export class ProjectQuotaService {
  constructor(
    private readonly projectQuotaRepository: ProjectQuotaRepository,
    private readonly projectRepository: ProjectRepository,
  ) {}

  async increaseUsed(projectId: string, used = 1): Promise<boolean> {
    const project = await this.projectRepository.findById(projectId);
    if (!project) return false;
    return this.projectQuotaRepository.increaseUsed(project, used);
  }

  async getCurrentMonthQuota(projectId: string): Promise<ProjectQuota> {
    return this.projectQuotaRepository.getCurrentMonthQuota(projectId);
  }
}
