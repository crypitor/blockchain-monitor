import { ServiceException } from '@app/global/global.exception';
import { MonitorAddressRepository } from '@app/shared_modules/monitor/repositories/monitor.address.repository';
import { MonitorRepository } from '@app/shared_modules/monitor/repositories/monitor.repository';
import {
  MonitorNotificationMethod,
  WebhookNotification,
} from '@app/shared_modules/monitor/schemas/monitor.schema';
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
  UpdateMonitorDto,
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
      throw new ServiceException('monitor not found', 404);
    }
    const member = await this.projectMemberRepository.findByUserAndProject(
      user.userId,
      monitor.projectId,
    );
    if (!member) {
      throw new ServiceException('not authorized', 401);
    }
    await this.webhookService.deleteWebhook(monitor.webhookId);
    await this.monitorRepository.deleteMonitor(monitor.monitorId);
    await this.projectRepository.increaseMonitorCount(monitor.projectId, -1);
    await MonitorAddressRepository.getRepository(
      monitor.network,
    ).deleteAllMonitorAddress(monitor.monitorId);
    return Builder<DeleteMonitorResponseDto>().success(true).build();
  }

  async updateMonitor(
    user: User,
    request: UpdateMonitorDto,
  ): Promise<MonitorResponseDto> {
    const monitor = await this.monitorRepository.findById(request.monitorId);
    if (!monitor) {
      throw new ServiceException('monitor not found', 404);
    }
    const member = await this.projectMemberRepository.findByUserAndProject(
      user.userId,
      monitor.projectId,
    );
    if (!member) {
      throw new ServiceException('not authorized', 401);
    }
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
    return this.monitorRepository
      .updateMonitor(monitor.monitorId, updateMonitor)
      .then((monitor) => MonitorResponseDto.from(monitor));
  }
}
