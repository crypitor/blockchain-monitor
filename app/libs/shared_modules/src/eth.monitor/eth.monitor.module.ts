import { Module } from '@nestjs/common';
import { EthMonitorProviders } from './eth.monitor.providers';
import { DatabaseModule } from '@app/database';

@Module({
  imports: [DatabaseModule],
  providers: [...EthMonitorProviders],
  exports: [...EthMonitorProviders],
})
export class EthMonitorModule {}
