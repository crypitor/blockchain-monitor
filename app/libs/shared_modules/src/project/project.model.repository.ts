import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { Project } from './schemas/project.schema';

@Injectable()
export class ProjectRepository {
  constructor(
    @Inject('PROJECT_MODEL') private readonly projectModel: Model<Project>,
  ) {}

  async findById(id: string): Promise<Project> {
    return await this.projectModel.findOne({ projectId: id });
  }
}
