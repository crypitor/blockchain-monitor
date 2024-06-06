import { DatabaseModule } from '../../../database/src';
import { Module } from '@nestjs/common';
import { ProjectProviders } from './project.provider';
import { ProjectMemberRepository } from './repositories/project.member.repository';
import { ProjectQuotaRepository } from './repositories/project.quota.repository';
import { ProjectRepository } from './repositories/project.repository';
import { ProjectQuotaService } from './services/project.quota.service';

@Module({
  imports: [DatabaseModule],
  providers: [
    ...ProjectProviders,
    ProjectRepository,
    ProjectQuotaRepository,
    ProjectMemberRepository,
    ProjectQuotaService,
  ],
  exports: [
    ...ProjectProviders,
    ProjectRepository,
    ProjectQuotaRepository,
    ProjectMemberRepository,
    ProjectQuotaService,
  ],
})
export class ProjectModule {}
