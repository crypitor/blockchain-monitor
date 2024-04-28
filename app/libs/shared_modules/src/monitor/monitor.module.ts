import { DatabaseModule } from '@app/database';
import { Module } from '@nestjs/common';
import { MonitorProviders } from './monitor.provider';
import {
  BscMonitorAddressRepository,
  EthMonitorAddressRepository,
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
  ],
  exports: [
    ...MonitorProviders,
    MonitorWebhookService,
    MonitorRepository,
    EthMonitorAddressRepository,
    BscMonitorAddressRepository,
    PolygonMonitorAddressRepository,
  ],
})
export class MonitorModule {}
