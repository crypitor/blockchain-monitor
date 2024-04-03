import { DatabaseModule } from '@app/database';
import { Module } from '@nestjs/common';
import { MonitorProviders } from './monitor.provider';
import {
  BscMonitorAddressRepository,
  EthMonitorAddressRepository,
} from './repositories/monitor.address.repository';
import { MonitorRepository } from './repositories/monitor.repository';

@Module({
  imports: [DatabaseModule],
  providers: [
    ...MonitorProviders,
    MonitorRepository,
    EthMonitorAddressRepository,
    BscMonitorAddressRepository,
  ],
  exports: [
    ...MonitorProviders,
    MonitorRepository,
    EthMonitorAddressRepository,
    BscMonitorAddressRepository,
  ],
})
export class MonitorModule {}
