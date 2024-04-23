import { DatabaseModule } from '@app/database';
import { Module } from '@nestjs/common';
import { MonitorProviders } from './monitor.provider';
import {
  BscMonitorAddressRepository,
  EthMonitorAddressRepository,
  PolygonMonitorAddressRepository,
} from './repositories/monitor.address.repository';
import { MonitorRepository } from './repositories/monitor.repository';

@Module({
  imports: [DatabaseModule],
  providers: [
    ...MonitorProviders,
    MonitorRepository,
    EthMonitorAddressRepository,
    BscMonitorAddressRepository,
    PolygonMonitorAddressRepository,
  ],
  exports: [
    ...MonitorProviders,
    MonitorRepository,
    EthMonitorAddressRepository,
    BscMonitorAddressRepository,
    PolygonMonitorAddressRepository,
  ],
})
export class MonitorModule {}
