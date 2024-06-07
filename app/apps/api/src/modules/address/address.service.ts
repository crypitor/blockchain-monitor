import { MonitorAddressRepository } from '@app/shared_modules/monitor/repositories/monitor.address.repository';
import { MonitorRepository } from '@app/shared_modules/monitor/repositories/monitor.repository';
import { MonitorAddress } from '@app/shared_modules/monitor/schemas/monitor.address.schema';
import { ProjectMemberRepository } from '@app/shared_modules/project/repositories/project.member.repository';
import { Injectable } from '@nestjs/common';
import { Builder } from 'builder-pattern';
import {
  CreateMonitorAddressDto,
  DeleteMonitorAddressDto,
  DeleteMonitorAddressResponseDto,
  GetMonitorAddressRequestDto,
  GetMonitorAddressResponseDto,
  MonitorAddressResponseDto,
  SearchMonitorAddressRequestDto,
} from './dto/address.dto';
import { MonitorApiService } from '../monitor/monitor.api.service';
import { DEFAULT_USER_ID } from '@app/shared_modules/monitor/dto/monitor.dto';

@Injectable()
export class MonitorAddressApiService {
  constructor(
    private readonly projectMemberRepository: ProjectMemberRepository,
    private readonly monitorRepository: MonitorRepository,
    private readonly monitorApiService: MonitorApiService,
  ) {}

  async createMonitorAddress(
    request: CreateMonitorAddressDto,
  ): Promise<MonitorAddressResponseDto[]> {
    const monitor = await this.monitorApiService.findMonitor(request.monitorId);
    const addresses = request.addresses.map((address) =>
      Builder<MonitorAddress>()
        .projectId(monitor.projectId)
        .monitorId(monitor.monitorId)
        .address(address.toLocaleLowerCase())
        .network(monitor.network)
        .createdBy(DEFAULT_USER_ID)
        .dateCreated(new Date())
        .build(),
    );
    const savedAddresses = await MonitorAddressRepository.getRepository(
      monitor.network,
    ).saveAll(addresses);
    await this.monitorRepository.increaseAddressCount(
      monitor.monitorId,
      savedAddresses.length,
    );
    return savedAddresses.map((address) =>
      MonitorAddressResponseDto.from(address),
    );
  }

  async getMonitorAddress(
    request: GetMonitorAddressRequestDto,
  ): Promise<GetMonitorAddressResponseDto> {
    const monitor = await this.monitorApiService.findMonitor(request.monitorId);
    return MonitorAddressRepository.getRepository(monitor.network)
      .getMonitorAddress(monitor.monitorId, request.limit, request.offset)
      .then((addresses) =>
        Builder<GetMonitorAddressResponseDto>()
          .addresses(
            addresses.map((address) => MonitorAddressResponseDto.from(address)),
          )
          .build(),
      );
  }

  async deleteMonitorAddress(
    request: DeleteMonitorAddressDto,
  ): Promise<DeleteMonitorAddressResponseDto> {
    const monitor = await this.monitorApiService.findMonitor(request.monitorId);
    // lower case request.addresses
    request.addresses = request.addresses.map((address) =>
      address.toLowerCase(),
    );
    const deletedCount = await MonitorAddressRepository.getRepository(
      monitor.network,
    ).deleteMonitorAddress(monitor.monitorId, request.addresses);

    await this.monitorRepository.increaseAddressCount(
      monitor.monitorId,
      -deletedCount,
    );
    return Builder<DeleteMonitorAddressResponseDto>().success(true).build();
  }

  async searchAddressInMonitor(
    request: SearchMonitorAddressRequestDto,
  ): Promise<GetMonitorAddressResponseDto> {
    const monitor = await this.monitorApiService.findMonitor(request.monitorId);
    return MonitorAddressRepository.getRepository(monitor.network)
      .findAddressByMonitorAndAddress(
        monitor.monitorId,
        request.address.toLowerCase(),
      )
      .then((addresses) =>
        Builder<GetMonitorAddressResponseDto>()
          .addresses(
            addresses.map((address) => MonitorAddressResponseDto.from(address)),
          )
          .build(),
      );
  }
}
