import { MonitorAddressRepository } from '@app/shared_modules/monitor/repositories/monitor.address.repository';
import { MonitorRepository } from '@app/shared_modules/monitor/repositories/monitor.repository';
import { MonitorAddress } from '@app/shared_modules/monitor/schemas/monitor.address.schema';
import { ProjectMemberRepository } from '@app/shared_modules/project/repositories/project.member.repository';
import { Injectable } from '@nestjs/common';
import { Builder } from 'builder-pattern';
import { MonitorService } from '../monitor/monitor.service';
import { User } from '../users/schemas/user.schema';
import {
  CreateMonitorAddressDto,
  DeleteMonitorAddressDto,
  DeleteMonitorAddressResponseDto,
  GetMonitorAddressRequestDto,
  GetMonitorAddressResponseDto,
  MonitorAddressResponseDto,
  SearchMonitorAddressRequestDto,
} from './dto/address.dto';

@Injectable()
export class MonitorAddressService {
  constructor(
    private readonly projectMemberRepository: ProjectMemberRepository,
    private readonly monitorRepository: MonitorRepository,
    private readonly monitorService: MonitorService,
  ) {}

  async createMonitorAddress(
    user: User,
    request: CreateMonitorAddressDto,
  ): Promise<MonitorAddressResponseDto[]> {
    const monitor = await this.monitorService.findAndAuthMonitor(
      user,
      request.monitorId,
    );
    const addresses = request.addresses.map((address) =>
      Builder<MonitorAddress>()
        .projectId(monitor.projectId)
        .monitorId(monitor.monitorId)
        .address(address.toLocaleLowerCase())
        .network(monitor.network)
        .createdBy(user.userId)
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
    user: User,
    request: GetMonitorAddressRequestDto,
  ): Promise<GetMonitorAddressResponseDto> {
    const monitor = await this.monitorService.findAndAuthMonitor(
      user,
      request.monitorId,
    );
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
    user: User,
    request: DeleteMonitorAddressDto,
  ): Promise<DeleteMonitorAddressResponseDto> {
    const monitor = await this.monitorService.findAndAuthMonitor(
      user,
      request.monitorId,
    );
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
    user: User,
    request: SearchMonitorAddressRequestDto,
  ): Promise<GetMonitorAddressResponseDto> {
    const monitor = await this.monitorService.findAndAuthMonitor(
      user,
      request.monitorId,
    );
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
