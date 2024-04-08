import { ServiceException } from '@app/global/global.exception';
import { MonitorAddressRepository } from '@app/shared_modules/monitor/repositories/monitor.address.repository';
import { MonitorRepository } from '@app/shared_modules/monitor/repositories/monitor.repository';
import { MonitorAddress } from '@app/shared_modules/monitor/schemas/monitor.address.schema';
import { ProjectMemberRepository } from '@app/shared_modules/project/repositories/project.member.repository';
import { Injectable } from '@nestjs/common';
import { Builder } from 'builder-pattern';
import { User } from '../users/schemas/user.schema';
import {
  CreateMonitorAddressDto,
  DeleteMonitorAddressDto,
  DeleteMonitorAddressResponseDto,
  GetMonitorAddressRequestDto,
  GetMonitorAddressResponseDto,
  MonitorAddressResponseDto,
} from './dto/address.dto';

@Injectable()
export class MonitorAddressService {
  constructor(
    private readonly projectMemberRepository: ProjectMemberRepository,
    private readonly monitorRepository: MonitorRepository,
  ) {}

  async createMonitorAddress(
    user: User,
    request: CreateMonitorAddressDto,
  ): Promise<MonitorAddressResponseDto[]> {
    const monitor = await this.monitorRepository.findById(request.monitorId);
    if (!monitor) {
      throw new ServiceException('monitor not found', 404);
    }
    const member = this.projectMemberRepository.findByUserAndProject(
      user.userId,
      monitor.projectId,
    );
    if (!member) {
      throw new ServiceException('unauthorized', 401);
    }
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
    return MonitorAddressRepository.getRepository(monitor.network)
      .saveAll(addresses)
      .then((addresses) =>
        addresses.map((address) => MonitorAddressResponseDto.from(address)),
      );
  }

  async getMonitorAddress(
    user: User,
    request: GetMonitorAddressRequestDto,
  ): Promise<GetMonitorAddressResponseDto> {
    const monitor = await this.monitorRepository.findById(request.monitorId);
    if (!monitor) {
      throw new ServiceException('monitor not found', 404);
    }
    const member = this.projectMemberRepository.findByUserAndProject(
      user.userId,
      monitor.projectId,
    );
    if (!member) {
      throw new ServiceException('unauthorized', 401);
    }
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
    const monitor = await this.monitorRepository.findById(request.monitorId);
    if (!monitor) {
      throw new ServiceException('monitor not found', 404);
    }
    const member = this.projectMemberRepository.findByUserAndProject(
      user.userId,
      monitor.projectId,
    );
    if (!member) {
      throw new ServiceException('unauthorized', 401);
    }
    // lower case request.addresses
    request.addresses = request.addresses.map((address) =>
      address.toLowerCase(),
    );
    return MonitorAddressRepository.getRepository(monitor.network)
      .deleteMonitorAddress(monitor.monitorId, request.addresses)
      .then(() =>
        Builder<DeleteMonitorAddressResponseDto>().success(true).build(),
      );
  }
}
