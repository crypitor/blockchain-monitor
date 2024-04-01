import { DatabaseModule } from '@app/database';
import { Module } from '@nestjs/common';
import { ProjectProviders } from './project.provider';
import { ProjectMemberRepository } from './repositories/project.member.repository';
import { ProjectQuotaRepository } from './repositories/project.quota.repository';
import { ProjectRepository } from './repositories/project.repository';

@Module({
  imports: [DatabaseModule],
  providers: [
    ...ProjectProviders,
    ProjectRepository,
    ProjectQuotaRepository,
    ProjectMemberRepository,
  ],
  exports: [
    ...ProjectProviders,
    ProjectRepository,
    ProjectQuotaRepository,
    ProjectMemberRepository,
  ],
})
export class ProjectModule {}
