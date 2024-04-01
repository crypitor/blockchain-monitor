import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { MonitorAddress } from '../schemas/monitor.address.schema';
import { MonitorNetwork } from '../schemas/monitor.schema';

export class MonitorAddressRepository {
  constructor(private readonly model: Model<MonitorAddress>) {}

  async saveAddress(address: MonitorAddress): Promise<MonitorAddress> {
    return await new this.model(address).save();
  }

  async findByAddress(address: string): Promise<MonitorAddress[]> {
    return await this.model.find({ address: address });
  }

  async findByAddressAndNetwork(
    address: string,
    network: MonitorNetwork,
  ): Promise<MonitorAddress[]> {
    return await this.model.find({ address: address, network: network });
  }

  async findByMonitorId(monitorId: string): Promise<MonitorAddress[]> {
    return await this.model.find({ monitorId: monitorId });
  }
}

@Injectable()
export class EthMonitorAddressRepository extends MonitorAddressRepository {
  constructor(
    @Inject('ETH_MONITOR_ADDRESS_MODEL') model: Model<MonitorAddress>,
  ) {
    super(model);
  }
}

@Injectable()
export class BscMonitorAddressRepository extends MonitorAddressRepository {
  constructor(
    @Inject('BSC_MONITOR_ADDRESS_MODEL') model: Model<MonitorAddress>,
  ) {
    super(model);
  }
}
