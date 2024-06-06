import { DatabaseModule } from '../../../database/src';
import { Module } from '@nestjs/common';
import { MonitorProviders } from './monitor.provider';
import {
  AvaxMonitorAddressRepository,
  BscMonitorAddressRepository,
  EthMonitorAddressRepository,
  MantleMonitorAddressRepository,
  PolygonMonitorAddressRepository,
} from './repositories/monitor.address.repository';
import { MonitorRepository } from './repositories/monitor.repository';
import { MonitorWebhookService } from './services/monitor.webhook.service';

@Module({
  imports: [DatabaseModule],
  providers: [
    ...MonitorProviders,
    MonitorWebhookService,
    MonitorRepository,
    EthMonitorAddressRepository,
    BscMonitorAddressRepository,
    PolygonMonitorAddressRepository,
    AvaxMonitorAddressRepository,
    MantleMonitorAddressRepository,
  ],
  exports: [
    ...MonitorProviders,
    MonitorWebhookService,
    MonitorRepository,
    EthMonitorAddressRepository,
    BscMonitorAddressRepository,
    PolygonMonitorAddressRepository,
    AvaxMonitorAddressRepository,
    MantleMonitorAddressRepository,
  ],
})
export class MonitorModule {}
