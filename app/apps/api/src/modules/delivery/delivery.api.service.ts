import { WebhookService } from '@app/shared_modules/webhook/webhook.service';
import { Injectable } from '@nestjs/common';
import {
  DeliveryAttemptResponseDto,
  GetMonitorDeliveryDto,
  MonitorDeliveryResponseDto,
} from './dto/delivery.api.dto';
import { MonitorApiService } from '../monitor/monitor.api.service';

@Injectable()
export class DeliveryApiService {
  constructor(
    private readonly webhookService: WebhookService,
    private readonly monitorApiService: MonitorApiService,
  ) {}

  async getMonitorDeliveries(
    request: GetMonitorDeliveryDto,
  ): Promise<MonitorDeliveryResponseDto[]> {
    const monitor = await this.monitorApiService.findMonitor(request.monitorId);

    return this.webhookService
      .getDeliveries(
        monitor.webhookId,
        request.limit,
        request.offset,
        request.status,
      )
      .then((response) => {
        return response.deliveries.map((delivery) =>
          MonitorDeliveryResponseDto.from(delivery),
        );
      });
  }

  async getDeliveryAttempt(
    deliveryId: string,
  ): Promise<DeliveryAttemptResponseDto[]> {
    return this.webhookService
      .getDeliveryAttempts(deliveryId)
      .then((response) => {
        return response.delivery_attempts.map((attempt) =>
          DeliveryAttemptResponseDto.from(attempt),
        );
      });
  }
}
