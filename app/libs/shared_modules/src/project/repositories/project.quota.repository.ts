import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { Project, ProjectQuota } from '../schemas/project.schema';

@Injectable()
export class ProjectQuotaRepository {
  constructor(
    @Inject('PROJECT_QUOTA_MODEL')
    private readonly projectQuotaModel: Model<ProjectQuota>,
  ) {}

  async increaseUsed(project: Project, used = 1): Promise<boolean> {
    const date = new Date();
    const month =
      `${date.getMonth() + 1}`.padStart(2, '0') + `${date.getFullYear()}`;
    return this.projectQuotaModel
      .updateOne(
        {
          projectId: project.projectId,
          month: month,
        },
        {
          $inc: { used: used },
          $setOnInsert: {
            ownerId: project.ownerId,
            quota: project.currentQuota || 0,
            dateCreated: date,
          },
        },
        {
          upsert: true,
        },
      )
      .then((result) => result.modifiedCount > 0 || result.upsertedCount > 0);
  }

  async getCurrentMonthQuota(projectId: string): Promise<ProjectQuota> {
    const date = new Date();
    const month =
      `${date.getMonth() + 1}`.padStart(2, '0') + `${date.getFullYear()}`;
    return this.projectQuotaModel
      .findOne({
        projectId: projectId,
        month: month,
      })
      .exec();
  }
}
