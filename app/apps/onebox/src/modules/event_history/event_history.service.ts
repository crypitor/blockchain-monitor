import { EthEventHistoryRepository } from '@app/shared_modules/event_history/repositories/event_history.repository';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { MonitorService } from '../monitor/monitor.service';
import { User } from '../users/schemas/user.schema';
import {
  GetMonitorEventHistoryDto,
  MonitorEventHistoryResponseDto,
} from './dto/event_history.dto';
import { MonitorNetwork } from '@app/shared_modules/monitor/schemas/monitor.schema';
import { ErrorCode } from '@app/global/global.error';

@Injectable()
export class EventHistoryService {
  private readonly logger = new Logger(EventHistoryService.name);
  constructor(
    private readonly ethEventHistoryRepository: EthEventHistoryRepository,
    private readonly monitorService: MonitorService,
  ) {}

  async getMonitorEventHistory(
    user: User,
    request: GetMonitorEventHistoryDto,
  ): Promise<MonitorEventHistoryResponseDto[]> {
    const monitor = await this.monitorService.findAndAuthMonitor(
      user,
      request.monitorId,
    );

    if (monitor !== undefined) {
      return this.ethEventHistoryRepository
        .getEventHistory(monitor.monitorId, request.limit, request.offset)
        .then((response) => {
          return response.map((event) =>
            MonitorEventHistoryResponseDto.from(event),
          );
        });
    }

    this.logger.error(`monitor not found`);
    throw ErrorCode.MONITOR_NOT_FOUND.asException();
  }
}
