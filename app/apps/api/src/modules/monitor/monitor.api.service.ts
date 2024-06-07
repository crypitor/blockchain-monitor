import { ErrorCode } from '@app/global/global.error';
import {
  CreateMonitorDto,
  DEFAULT_USER_ID,
  DeleteMonitorDto,
  DeleteMonitorResponseDto,
  ListMonitorDto,
  MonitorResponseDto,
  UpdateMonitorDto,
} from '@app/shared_modules/monitor/dto/monitor.dto';
import { MonitorAddressRepository } from '@app/shared_modules/monitor/repositories/monitor.address.repository';
import { MonitorRepository } from '@app/shared_modules/monitor/repositories/monitor.repository';
import {
  Monitor,
  MonitorNotificationMethod,
  WebhookNotification,
} from '@app/shared_modules/monitor/schemas/monitor.schema';
import { WebhookService } from '@app/shared_modules/webhook/webhook.service';
import { measureTime } from '@app/utils/time.utils';
import { Injectable } from '@nestjs/common';
import { Builder } from 'builder-pattern';

@Injectable()
export class MonitorApiService {
  constructor(
    private readonly monitorRepository: MonitorRepository,
    private readonly webhookService: WebhookService,
  ) {}

  async findMonitor(monitorId: string): Promise<Monitor> {
    const monitor = await this.monitorRepository.findById(monitorId);
    if (!monitor) {
      throw ErrorCode.MONITOR_NOT_FOUND.asException();
    }
    return monitor;
  }

  async listMonitors(request: ListMonitorDto): Promise<MonitorResponseDto[]> {
    const monitors = await this.monitorRepository.listMonitors(request);
    return monitors.map((monitor) => MonitorResponseDto.from(monitor));
  }

  async getMonitor(monitorId: string): Promise<MonitorResponseDto> {
    const monitor = await this.findMonitor(monitorId);
    return MonitorResponseDto.from(monitor);
  }

  async createMonitor(request: CreateMonitorDto): Promise<MonitorResponseDto> {
    const monitor = request.toMonitor(DEFAULT_USER_ID);
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
    // todo: check max monitor
    return MonitorResponseDto.from(monitor);
  }

  async deleteMonitor(
    request: DeleteMonitorDto,
  ): Promise<DeleteMonitorResponseDto> {
    const monitor = await this.monitorRepository.findById(request.monitorId);
    if (!monitor) {
      return Builder<DeleteMonitorResponseDto>().success(true).build();
    }
    await measureTime('delete_monitor_resource', async () => {
      Promise.all([
        this.monitorRepository.deleteMonitor(monitor.monitorId),
        MonitorAddressRepository.getRepository(
          monitor.network,
        ).deleteAllMonitorAddress(monitor.monitorId),
      ]);
    });

    if (monitor.notification.method === MonitorNotificationMethod.Webhook) {
      const method = monitor.notification as WebhookNotification;
      await this.webhookService.updateWebhook(monitor.webhookId, {
        name: monitor.monitorId,
        webhookUrl: method.url,
        secret_token: method.secret_token,
        authorization: method.authorization,
        active: false,
      });
    }

    return Builder<DeleteMonitorResponseDto>().success(true).build();
  }

  async updateMonitor(request: UpdateMonitorDto): Promise<MonitorResponseDto> {
    const monitor = await this.findMonitor(request.monitorId);
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

    return await this.monitorRepository
      .updateMonitor(monitor.monitorId, updateMonitor)
      .then(async (monitor) => {
        // @todo handle error on update webhook service
        if (monitor.notification) {
          if (
            request.notification.method === MonitorNotificationMethod.Webhook
          ) {
            const method = monitor.notification as WebhookNotification;
            await this.webhookService.updateWebhook(monitor.webhookId, {
              name: monitor.monitorId,
              webhookUrl: method.url,
              secret_token: method.secret_token,
              authorization: method.authorization,
              active: true,
            });
          }
        }
        return MonitorResponseDto.from(monitor);
      });
  }
}
