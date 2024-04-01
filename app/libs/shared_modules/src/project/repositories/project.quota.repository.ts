import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { ProjectQuota } from '../schemas/project.schema';

@Injectable()
export class ProjectQuotaRepository {
  constructor(
    @Inject('PROJECT_QUOTA_MODEL')
    private readonly projectQuotaModel: Model<ProjectQuota>,
  ) {}
}
