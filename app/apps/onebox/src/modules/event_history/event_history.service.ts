import { ErrorCode } from '@app/global/global.error';
import {
  AvaxEventHistoryRepository,
  EthEventHistoryRepository,
  PolygonEventHistoryRepository,
} from '@app/shared_modules/event_history/repositories/event_history.repository';
import { MonitorNetwork } from '@app/shared_modules/monitor/schemas/monitor.schema';
import { Injectable, Logger } from '@nestjs/common';
import { MonitorService } from '../monitor/monitor.service';
import { User } from '../users/schemas/user.schema';
import {
  GetMonitorEventHistoryDto,
  MonitorEventHistoryResponseDto,
} from './dto/event_history.dto';

@Injectable()
export class EventHistoryService {
  private readonly logger = new Logger(EventHistoryService.name);
  constructor(
    private readonly ethEventHistoryRepository: EthEventHistoryRepository,
    private readonly polygonEventHistoryRepository: PolygonEventHistoryRepository,
    private readonly avaxEventHistoryRepository: AvaxEventHistoryRepository,
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

    if (!monitor) {
      throw ErrorCode.MONITOR_NOT_FOUND.asException();
    }

    if (monitor.network === MonitorNetwork.Ethereum) {
      return this.ethEventHistoryRepository
        .getEventHistory(monitor.monitorId, request.limit, request.offset)
        .then((response) => {
          return response.map((event) =>
            MonitorEventHistoryResponseDto.from(event),
          );
        });
    }

    if (monitor.network === MonitorNetwork.Polygon) {
      return this.polygonEventHistoryRepository
        .getEventHistory(monitor.monitorId, request.limit, request.offset)
        .then((response) => {
          return response.map((event) =>
            MonitorEventHistoryResponseDto.from(event),
          );
        });
    }

    if (monitor.network === MonitorNetwork.Avalanche) {
      return this.avaxEventHistoryRepository
        .getEventHistory(monitor.monitorId, request.limit, request.offset)
        .then((response) => {
          return response.map((event) =>
            MonitorEventHistoryResponseDto.from(event),
          );
        });
    }

    this.logger.error(`network ${monitor.network} not supported`);
    throw ErrorCode.INTERNAL_SERVER_ERROR.asException();
  }
}
