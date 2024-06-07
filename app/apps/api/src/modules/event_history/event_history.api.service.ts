import { ErrorCode } from '@app/global/global.error';
import {
  AvaxEventHistoryRepository,
  BscEventHistoryRepository,
  EthEventHistoryRepository,
  MantleEventHistoryRepository,
  PolygonEventHistoryRepository,
} from '@app/shared_modules/event_history/repositories/event_history.repository';
import { MonitorNetwork } from '@app/shared_modules/monitor/schemas/monitor.schema';
import { Injectable, Logger } from '@nestjs/common';
import {
  GetMonitorEventHistoryByAssociatedAddressDto,
  GetMonitorEventHistoryByEventIdDto,
  GetMonitorEventHistoryByHashDto,
  GetMonitorEventHistoryDto,
  MonitorEventHistoryResponseDto,
} from './dto/event_history.api.dto';
import { MonitorApiService } from '../monitor/monitor.api.service';

@Injectable()
export class EventHistoryApiService {
  private readonly logger = new Logger(EventHistoryApiService.name);
  constructor(
    private readonly ethEventHistoryRepository: EthEventHistoryRepository,
    private readonly polygonEventHistoryRepository: PolygonEventHistoryRepository,
    private readonly avaxEventHistoryRepository: AvaxEventHistoryRepository,
    private readonly mantleEventHistoryRepository: MantleEventHistoryRepository,
    private readonly bscEventHistoryRepository: BscEventHistoryRepository,
    private readonly monitorApiService: MonitorApiService,
  ) {}

  async getMonitorEventHistory(
    request: GetMonitorEventHistoryDto,
  ): Promise<MonitorEventHistoryResponseDto[]> {
    const monitor = await this.monitorApiService.findMonitor(request.monitorId);

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

    if (monitor.network === MonitorNetwork.Mantle) {
      return this.mantleEventHistoryRepository
        .getEventHistory(monitor.monitorId, request.limit, request.offset)
        .then((response) => {
          return response.map((event) =>
            MonitorEventHistoryResponseDto.from(event),
          );
        });
    }

    if (monitor.network === MonitorNetwork.BSC) {
      return this.bscEventHistoryRepository
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

  async getMonitorEventHistoryByTxnHash(
    request: GetMonitorEventHistoryByHashDto,
  ): Promise<MonitorEventHistoryResponseDto[]> {
    const monitor = await this.monitorApiService.findMonitor(request.monitorId);

    if (!monitor) {
      throw ErrorCode.MONITOR_NOT_FOUND.asException();
    }
    if (monitor.network === MonitorNetwork.Ethereum) {
      return this.ethEventHistoryRepository
        .findEventHistoryByMonitorAndHash(
          monitor.monitorId,
          request.hash,
          request.limit,
          request.offset,
        )
        .then((response) => {
          return response.map((event) =>
            MonitorEventHistoryResponseDto.from(event),
          );
        });
    }
    if (monitor.network === MonitorNetwork.Polygon) {
      return this.polygonEventHistoryRepository
        .findEventHistoryByMonitorAndHash(
          monitor.monitorId,
          request.hash,
          request.limit,
          request.offset,
        )
        .then((response) => {
          return response.map((event) =>
            MonitorEventHistoryResponseDto.from(event),
          );
        });
    }

    if (monitor.network === MonitorNetwork.Avalanche) {
      return this.avaxEventHistoryRepository
        .findEventHistoryByMonitorAndHash(
          monitor.monitorId,
          request.hash,
          request.limit,
          request.offset,
        )
        .then((response) => {
          return response.map((event) =>
            MonitorEventHistoryResponseDto.from(event),
          );
        });
    }

    if (monitor.network === MonitorNetwork.Mantle) {
      return this.mantleEventHistoryRepository
        .findEventHistoryByMonitorAndHash(
          monitor.monitorId,
          request.hash,
          request.limit,
          request.offset,
        )
        .then((response) => {
          return response.map((event) =>
            MonitorEventHistoryResponseDto.from(event),
          );
        });
    }

    if (monitor.network === MonitorNetwork.BSC) {
      return this.bscEventHistoryRepository
        .findEventHistoryByMonitorAndHash(
          monitor.monitorId,
          request.hash,
          request.limit,
          request.offset,
        )
        .then((response) => {
          return response.map((event) =>
            MonitorEventHistoryResponseDto.from(event),
          );
        });
    }

    this.logger.error(`network ${monitor.network} not supported`);
    throw ErrorCode.INTERNAL_SERVER_ERROR.asException();
  }

  async getMonitorEventHistoryByAssociatedAddress(
    request: GetMonitorEventHistoryByAssociatedAddressDto,
  ): Promise<MonitorEventHistoryResponseDto[]> {
    const monitor = await this.monitorApiService.findMonitor(request.monitorId);

    if (!monitor) {
      throw ErrorCode.MONITOR_NOT_FOUND.asException();
    }
    if (monitor.network === MonitorNetwork.Ethereum) {
      return this.ethEventHistoryRepository
        .findByMonitorAndAssociatedAddress(
          monitor.monitorId,
          request.associatedAddress,
          request.limit,
          request.offset,
        )
        .then((response) => {
          return response.map((event) =>
            MonitorEventHistoryResponseDto.from(event),
          );
        });
    }
    if (monitor.network === MonitorNetwork.Polygon) {
      return this.polygonEventHistoryRepository
        .findEventHistoryByMonitorAndHash(
          monitor.monitorId,
          request.associatedAddress,
          request.limit,
          request.offset,
        )
        .then((response) => {
          return response.map((event) =>
            MonitorEventHistoryResponseDto.from(event),
          );
        });
    }

    if (monitor.network === MonitorNetwork.Avalanche) {
      return this.avaxEventHistoryRepository
        .findEventHistoryByMonitorAndHash(
          monitor.monitorId,
          request.associatedAddress,
          request.limit,
          request.offset,
        )
        .then((response) => {
          return response.map((event) =>
            MonitorEventHistoryResponseDto.from(event),
          );
        });
    }

    if (monitor.network === MonitorNetwork.Mantle) {
      return this.mantleEventHistoryRepository
        .findEventHistoryByMonitorAndHash(
          monitor.monitorId,
          request.associatedAddress,
          request.limit,
          request.offset,
        )
        .then((response) => {
          return response.map((event) =>
            MonitorEventHistoryResponseDto.from(event),
          );
        });
    }

    if (monitor.network === MonitorNetwork.BSC) {
      return this.bscEventHistoryRepository
        .findEventHistoryByMonitorAndHash(
          monitor.monitorId,
          request.associatedAddress,
          request.limit,
          request.offset,
        )
        .then((response) => {
          return response.map((event) =>
            MonitorEventHistoryResponseDto.from(event),
          );
        });
    }

    this.logger.error(`network ${monitor.network} not supported`);
    throw ErrorCode.INTERNAL_SERVER_ERROR.asException();
  }

  async getMonitorEventHistoryByEventId(
    request: GetMonitorEventHistoryByEventIdDto,
  ): Promise<MonitorEventHistoryResponseDto> {
    const monitor = await this.monitorApiService.findMonitor(request.monitorId);

    if (!monitor) {
      throw ErrorCode.MONITOR_NOT_FOUND.asException();
    }
    if (monitor.network === MonitorNetwork.Ethereum) {
      return this.ethEventHistoryRepository
        .findByEventId(request.eventId)
        .then((response) => {
          return MonitorEventHistoryResponseDto.from(response);
        });
    }
    if (monitor.network === MonitorNetwork.Polygon) {
      return this.polygonEventHistoryRepository
        .findByEventId(request.eventId)
        .then((response) => {
          return MonitorEventHistoryResponseDto.from(response);
        });
    }

    if (monitor.network === MonitorNetwork.Avalanche) {
      return this.avaxEventHistoryRepository
        .findByEventId(request.eventId)
        .then((response) => {
          return MonitorEventHistoryResponseDto.from(response);
        });
    }

    if (monitor.network === MonitorNetwork.Mantle) {
      return this.mantleEventHistoryRepository
        .findByEventId(request.eventId)
        .then((response) => {
          return MonitorEventHistoryResponseDto.from(response);
        });
    }

    if (monitor.network === MonitorNetwork.BSC) {
      return this.bscEventHistoryRepository
        .findByEventId(request.eventId)
        .then((response) => {
          return MonitorEventHistoryResponseDto.from(response);
        });
    }

    this.logger.error(`network ${monitor.network} not supported`);
    throw ErrorCode.INTERNAL_SERVER_ERROR.asException();
  }
}
