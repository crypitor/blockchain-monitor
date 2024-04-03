import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { ProjectMember } from '../schemas/project.schema';

@Injectable()
export class ProjectMemberRepository {
  constructor(
    @Inject('PROJECT_MEMBER_MODEL')
    private readonly projectMemnberModel: Model<ProjectMember>,
  ) {}

  async save(member: ProjectMember) {
    return await new this.projectMemnberModel(member).save();
  }

  async findByUserAndProject(userId: string, projectId: string) {
    return await this.projectMemnberModel.findOne({ projectId, userId });
  }
}
