import { ServiceException } from '@app/global/global.exception';
import { MonitorAddressRepository } from '@app/shared_modules/monitor/repositories/monitor.address.repository';
import { MonitorRepository } from '@app/shared_modules/monitor/repositories/monitor.repository';
import { ProjectMemberRepository } from '@app/shared_modules/project/repositories/project.member.repository';
import { ProjectRepository } from '@app/shared_modules/project/repositories/project.repository';
import { WebhookService } from '@app/shared_modules/webhook/webhook.service';
import { Injectable } from '@nestjs/common';
import { Builder } from 'builder-pattern';
import { User } from '../users/schemas/user.schema';
import {
  CreateMonitorDto,
  DeleteMonitorDto,
  DeleteMonitorResponseDto,
  MonitorResponseDto,
} from './dto/monitor.dto';

@Injectable()
export class MonitorService {
  constructor(
    private readonly projectMemberRepository: ProjectMemberRepository,
    private readonly projectRepository: ProjectRepository,
    private readonly monitorRepository: MonitorRepository,
    private readonly webhookService: WebhookService,
  ) {}

  async listMonitors(
    user: User,
    projectId: string,
  ): Promise<MonitorResponseDto[]> {
    const member = await this.projectMemberRepository.findByUserAndProject(
      user.userId,
      projectId,
    );
    if (!member) {
      throw new Error('not authorized');
    }
    const monitors = await this.monitorRepository.listMonitorsByProject(
      projectId,
    );
    return monitors.map((monitor) => MonitorResponseDto.from(monitor));
  }

  async getMonitor(user: User, monitorId: string): Promise<MonitorResponseDto> {
    const monitor = await this.monitorRepository.findById(monitorId);
    if (!monitor) {
      throw new ServiceException('monitor not found', 404);
    }
    const member = await this.projectMemberRepository.findByUserAndProject(
      user.userId,
      monitor.projectId,
    );
    if (!member) {
      throw new Error('not authorized');
    }
    return MonitorResponseDto.from(monitor);
  }

  async createMonitor(
    user: User,
    request: CreateMonitorDto,
  ): Promise<MonitorResponseDto> {
    const member = await this.projectMemberRepository.findByUserAndProject(
      user.userId,
      request.projectId,
    );
    if (!member) {
      throw new Error('not authorized');
    }

    const monitor = request.toMonitor(user.userId);
    // request create webhook in webhook microservice
    // if (monitor.notification.method === MonitorNotificationMethod.Webhook) {
    //   const method = monitor.notification as WebhookNotification;
    //   const webhookId = await this.webhookService.createWebhook(
    //     monitor.monitorId,
    //     monitor.notification.method,
    //     method.secret_token,
    //     method.authorization,
    //   );
    //   monitor.webhookId = webhookId;
    // }
    await this.monitorRepository.saveMonitor(monitor);
    await this.projectRepository.increaseMonitorCount(monitor.projectId, 1);
    // todo: check max monitor
    return MonitorResponseDto.from(monitor);
  }

  async deleteMonitor(
    user: User,
    request: DeleteMonitorDto,
  ): Promise<DeleteMonitorResponseDto> {
    const monitor = await this.monitorRepository.findById(request.monitorId);
    if (!monitor) {
      throw new ServiceException('monitor not found', 404);
    }
    const member = await this.projectMemberRepository.findByUserAndProject(
      user.userId,
      monitor.projectId,
    );
    if (!member) {
      throw new Error('not authorized');
    }
    await this.monitorRepository.deleteMonitor(monitor.monitorId);
    await this.projectRepository.increaseMonitorCount(monitor.projectId, -1);
    await MonitorAddressRepository.getRepository(
      monitor.network,
    ).deleteAllMonitorAddress(monitor.monitorId);
    return Builder<DeleteMonitorResponseDto>().success(true).build();
  }
}
