import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export enum ProjectStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

@Schema()
export class Project {
  @Prop({ required: true, unique: true })
  projectId: string;

  @Prop({ required: true, index: 1 })
  ownerId: string;

  @Prop()
  name: string;

  @Prop()
  status: ProjectStatus;

  @Prop()
  maxMember: number;

  @Prop()
  memberCount: number;

  @Prop()
  maxMonitor: number;

  @Prop()
  monitorCount: number;

  @Prop()
  maxAddress: number;

  @Prop()
  addressCount: number;

  @Prop()
  dateCreated: Date;
}
export type ProjectDocument = HydratedDocument<Project>;
export const ProjectSchema = SchemaFactory.createForClass(Project);

@Schema()
export class ProjectQuota {
  @Prop({ required: true, index: 1 })
  projectId: string;

  @Prop({ required: true })
  month: string;

  @Prop({ required: true, index: 1 })
  ownerId: string;

  @Prop({ required: true })
  quota: number;

  @Prop({ required: true })
  used: number;

  @Prop({ required: true })
  dateCreated: Date;
}
export type ProjectQuotaDocument = HydratedDocument<ProjectQuota>;
export const ProjectQuotaSchema = SchemaFactory.createForClass(ProjectQuota);
ProjectQuotaSchema.index({ projectId: 1, month: 1 }, { unique: true });

export enum ProjectRole {
  OWNER = 'owner',
  MEMBER = 'member',
}

@Schema()
export class ProjectMember {
  @Prop({ required: true, index: 1 })
  projectId: string;

  @Prop({ required: true, index: 1 })
  userId: string;

  @Prop({ required: true })
  role: ProjectRole;
}
export type ProjectMemberDocument = HydratedDocument<ProjectMember>;
export const ProjectMemberSchema = SchemaFactory.createForClass(ProjectMember);
ProjectMemberSchema.index({ projectId: 1, userId: 1 }, { unique: true });
