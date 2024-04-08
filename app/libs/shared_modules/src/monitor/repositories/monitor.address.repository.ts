import { ServiceException } from '@app/global/global.exception';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { MongoServerError } from 'mongodb';
import { Model } from 'mongoose';
import { MonitorAddress } from '../schemas/monitor.address.schema';
import { MonitorNetwork } from '../schemas/monitor.schema';

export class MonitorAddressRepository {
  static repositories: Map<MonitorNetwork, MonitorAddressRepository> =
    new Map();

  static getRepository(network: MonitorNetwork): MonitorAddressRepository {
    return MonitorAddressRepository.repositories[network];
  }

  constructor(
    network: MonitorNetwork,
    private readonly model: Model<MonitorAddress>,
  ) {
    MonitorAddressRepository.repositories[network] = this;
  }

  async saveAddress(address: MonitorAddress): Promise<MonitorAddress> {
    return new this.model(address).save();
  }

  async saveAll(addresses: MonitorAddress[]): Promise<MonitorAddress[]> {
    return this.model
      .insertMany(addresses)
      .then((result) => result)
      .catch((err) => {
        if (err instanceof MongoServerError && err.code === 11000) {
          throw new ServiceException('Address already exists', 400);
        } else {
          Logger.error(err);
          throw new ServiceException('Internal Server Error', 500);
        }
      });
  }

  async findByAddress(address: string): Promise<MonitorAddress[]> {
    return this.model.find({ address: address });
  }

  async findByAddressAndNetwork(
    address: string,
    network: MonitorNetwork,
  ): Promise<MonitorAddress[]> {
    return this.model.find({ address: address, network: network });
  }

  async findByMonitorId(monitorId: string): Promise<MonitorAddress[]> {
    return this.model.find({ monitorId: monitorId });
  }

  async getMonitorAddress(
    monitorId: string,
    limit: number,
    offset: number,
  ): Promise<MonitorAddress[]> {
    return this.model
      .find({ monitorId: monitorId })
      .limit(limit)
      .skip(offset)
      .sort({ dateCreated: -1 });
  }

  async deleteMonitorAddress(
    monitorId: string,
    addresses: string[],
  ): Promise<number> {
    return this.model
      .deleteMany({
        monitorId: monitorId,
        address: { $in: addresses },
      })
      .then((result) => result.deletedCount);
  }

  async deleteAllMonitorAddress(monitorId: string): Promise<number> {
    return this.model
      .deleteMany({ monitorId: monitorId })
      .then((result) => result.deletedCount);
  }
}

@Injectable()
export class EthMonitorAddressRepository extends MonitorAddressRepository {
  constructor(
    @Inject('ETH_MONITOR_ADDRESS_MODEL') model: Model<MonitorAddress>,
  ) {
    super(MonitorNetwork.Ethereum, model);
  }
}

@Injectable()
export class BscMonitorAddressRepository extends MonitorAddressRepository {
  constructor(
    @Inject('BSC_MONITOR_ADDRESS_MODEL') model: Model<MonitorAddress>,
  ) {
    super(MonitorNetwork.BSC, model);
  }
}
