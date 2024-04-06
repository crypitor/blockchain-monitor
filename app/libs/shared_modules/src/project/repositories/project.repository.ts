import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { Project } from '../schemas/project.schema';

@Injectable()
export class ProjectRepository {
  constructor(
    @Inject('PROJECT_MODEL') private readonly projectModel: Model<Project>,
  ) {}

  async findById(id: string): Promise<Project> {
    return this.projectModel.findOne({ projectId: id });
  }

  async saveProject(project: Project): Promise<Project> {
    return new this.projectModel(project).save();
  }

  async listUserProjects(userId: string): Promise<Project[]> {
    return this.projectModel.find({ ownerId: userId });
  }

  async increaseMonitorCount(
    projectId: string,
    count: number,
  ): Promise<Project> {
    return this.projectModel
      .findOneAndUpdate(
        { projectId },
        { $inc: { monitorCount: count } },
        { new: true },
      )
      .exec();
  }
}
