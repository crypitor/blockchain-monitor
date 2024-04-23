import { DatabaseModule } from '@app/database';
import { Module } from '@nestjs/common';
import { MonitorProviders } from './monitor.provider';
import {
  BscMonitorAddressRepository,
  EthMonitorAddressRepository,
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
  ],
  exports: [
    ...MonitorProviders,
    MonitorWebhookService,
    MonitorRepository,
    EthMonitorAddressRepository,
    BscMonitorAddressRepository,
  ],
})
export class MonitorModule {}
