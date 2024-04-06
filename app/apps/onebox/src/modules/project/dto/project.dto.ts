import {
  Project,
  ProjectStatus,
} from '@app/shared_modules/project/schemas/project.schema';
import { ApiProperty, ApiResponseProperty } from '@nestjs/swagger';
import { Builder } from 'builder-pattern';
import { IsNotEmpty } from 'class-validator';

export class CreateProjectDto {
  @ApiProperty()
  @IsNotEmpty()
  name: string;
}

export class ProjectResponseDto {
  @ApiResponseProperty()
  projectId: string;

  @ApiResponseProperty()
  ownerId: string;

  @ApiResponseProperty()
  name: string;

  @ApiResponseProperty()
  status: ProjectStatus;

  @ApiResponseProperty()
  maxMember: number;

  @ApiResponseProperty()
  memberCount: number;

  @ApiResponseProperty()
  maxMonitor: number;

  @ApiResponseProperty()
  monitorCount: number;

  @ApiResponseProperty()
  maxAddress: number;

  @ApiResponseProperty()
  addressCount: number;

  @ApiResponseProperty()
  dateCreated: Date;

  static from(project: Project) {
    return Builder<ProjectResponseDto>()
      .projectId(project.projectId)
      .ownerId(project.ownerId)
      .name(project.name)
      .status(project.status)
      .maxMember(project.maxMember)
      .memberCount(project.memberCount)
      .maxMonitor(project.maxMonitor)
      .monitorCount(project.monitorCount)
      .maxAddress(project.maxAddress)
      .addressCount(project.addressCount)
      .dateCreated(project.dateCreated)
      .build();
  }
}
