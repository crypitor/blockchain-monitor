import { ErrorCode } from '@app/global/global.error';
import { MonitorAddressRepository } from '@app/shared_modules/monitor/repositories/monitor.address.repository';
import { MonitorRepository } from '@app/shared_modules/monitor/repositories/monitor.repository';
import {
  Monitor,
  MonitorNotificationMethod,
  WebhookNotification,
} from '@app/shared_modules/monitor/schemas/monitor.schema';
import { ProjectMemberRepository } from '@app/shared_modules/project/repositories/project.member.repository';
import { ProjectRepository } from '@app/shared_modules/project/repositories/project.repository';
import { WebhookService } from '@app/shared_modules/webhook/webhook.service';
import { measureTime } from '@app/utils/time.utils';
import { Injectable } from '@nestjs/common';
import { Builder } from 'builder-pattern';
import { ProjectService } from '../project/project.service';
import { User } from '../users/schemas/user.schema';
import {
  CreateMonitorDto,
  DeleteMonitorDto,
  DeleteMonitorResponseDto,
  ListMonitorDto,
  MonitorResponseDto,
  UpdateMonitorDto,
} from './dto/monitor.dto';

@Injectable()
export class MonitorService {
  constructor(
    private readonly projectMemberRepository: ProjectMemberRepository,
    private readonly projectRepository: ProjectRepository,
    private readonly monitorRepository: MonitorRepository,
    private readonly webhookService: WebhookService,
    private readonly projectService: ProjectService,
  ) {}

  async findAndAuthMonitor(user: User, monitorId: string): Promise<Monitor> {
    const monitor = await this.monitorRepository.findById(monitorId);
    if (!monitor) {
      throw ErrorCode.MONITOR_NOT_FOUND.asException();
    }
    await this.projectService.checkProjectPermission(user, monitor.projectId);
    return monitor;
  }

  async listMonitors(
    user: User,
    request: ListMonitorDto,
  ): Promise<MonitorResponseDto[]> {
    this.projectService.checkProjectPermission(user, request.projectId);
    const monitors = await this.monitorRepository.listMonitors(request);
    return monitors.map((monitor) => MonitorResponseDto.from(monitor));
  }

  async getMonitor(user: User, monitorId: string): Promise<MonitorResponseDto> {
    const monitor = await this.findAndAuthMonitor(user, monitorId);
    return MonitorResponseDto.from(monitor);
  }

  async createMonitor(
    user: User,
    request: CreateMonitorDto,
  ): Promise<MonitorResponseDto> {
    this.projectService.checkProjectPermission(user, request.projectId);

    const monitor = request.toMonitor(user.userId);
    // request create webhook in webhook microservice
    if (monitor.notification.method === MonitorNotificationMethod.Webhook) {
      const method = monitor.notification as WebhookNotification;
      const webhookId = await this.webhookService.createWebhook(
        monitor.monitorId,
        method.url,
        method.secret_token,
        method.authorization,
      );
      monitor.webhookId = webhookId;
    }
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
      return Builder<DeleteMonitorResponseDto>().success(true).build();
    }
    await this.projectService.checkProjectPermission(user, monitor.projectId);
    await measureTime('delete_monitor_resource', async () => {
      Promise.all([
        this.webhookService.deleteWebhook(monitor.webhookId),
        this.monitorRepository.deleteMonitor(monitor.monitorId),
        this.projectRepository.increaseMonitorCount(monitor.projectId, -1),
        MonitorAddressRepository.getRepository(
          monitor.network,
        ).deleteAllMonitorAddress(monitor.monitorId),
      ]);
    });

    return Builder<DeleteMonitorResponseDto>().success(true).build();
  }

  async updateMonitor(
    user: User,
    request: UpdateMonitorDto,
  ): Promise<MonitorResponseDto> {
    const monitor = await this.findAndAuthMonitor(user, request.monitorId);
    const updateMonitor = new Map<string, any>();
    if (request.name) {
      updateMonitor['name'] = request.name;
    }
    if (request.condition) {
      if (request.condition.native != undefined) {
        updateMonitor['condition.native'] = request.condition.native;
      }
      if (request.condition.internal != undefined) {
        updateMonitor['condition.internal'] = request.condition.internal;
      }
      if (request.condition.erc721 != undefined) {
        updateMonitor['condition.erc721'] = request.condition.erc721;
      }
      if (request.condition.erc20 != undefined) {
        updateMonitor['condition.erc20'] = request.condition.erc20;
      }
      if (request.condition.specific != undefined) {
        updateMonitor['condition.specific'] = request.condition.specific;
      }
      if (request.condition.cryptos != undefined) {
        updateMonitor['condition.cryptos'] = request.condition.cryptos;
      }
    }
    if (request.notification) {
      updateMonitor['notification'] = request.notification;
    }
    if (request.type) {
      updateMonitor['type'] = request.type;
    }
    if (request.note) {
      updateMonitor['note'] = request.note;
    }
    if (request.tags) {
      updateMonitor['tags'] = request.tags;
    }
    if (request.disabled != undefined) {
      updateMonitor['disabled'] = request.disabled;
    }
    return this.monitorRepository
      .updateMonitor(monitor.monitorId, updateMonitor)
      .then((monitor) => MonitorResponseDto.from(monitor));
  }
}
