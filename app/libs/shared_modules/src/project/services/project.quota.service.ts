import { Injectable, Logger } from '@nestjs/common';
import { ProjectQuotaRepository } from '../repositories/project.quota.repository';
import { ProjectRepository } from '../repositories/project.repository';
import { ProjectQuota } from '../schemas/project.schema';
import NodeCache = require('node-cache');

@Injectable()
export class ProjectQuotaService {
  private cache: NodeCache;
  constructor(
    private readonly projectQuotaRepository: ProjectQuotaRepository,
    private readonly projectRepository: ProjectRepository,
  ) {
    this.cache = new NodeCache({
      stdTTL: 60,
      checkperiod: 60,
      useClones: false,
    });
    this.cache.on('expired', (_, value) => {
      this.increaseUsedInDB(value.projectId, value.used);
      Logger.debug('Cache stats: ', this.cache.stats);
    });
  }

  async increaseUsed(projectId: string, used = 1): Promise<boolean> {
    const minute = (new Date().getTime() / 1000 / 60).toFixed(0);
    const cacheKey = projectId + '_' + minute;
    let cache: ProjectQuotaCache = this.cache.get(cacheKey);
    if (!cache) {
      cache = new ProjectQuotaCache(projectId, 0);
      this.cache.set(cacheKey, cache);
    }
    cache.used += used;
    Logger.log(`Project Quota cache ${cacheKey}: ${JSON.stringify(cache)}`);
    return true;
  }

  async increaseUsedInDB(projectId: string, used = 1): Promise<boolean> {
    Logger.log(`increaseUsedInDB: ${projectId}-${used}`);
    const project = await this.projectRepository.findById(projectId);
    if (!project) return false;
    return this.projectQuotaRepository.increaseUsed(project, used);
  }

  async getCurrentMonthQuota(projectId: string): Promise<ProjectQuota> {
    return this.projectQuotaRepository.getCurrentMonthQuota(projectId);
  }
}

class ProjectQuotaCache {
  projectId: string;
  used: number;
  constructor(projectId: string, used: number) {
    this.projectId = projectId;
    this.used = used;
  }
}
