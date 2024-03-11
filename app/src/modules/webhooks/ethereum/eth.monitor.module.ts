import { Module } from '@nestjs/common';
import { EthMonitorService } from './eth.monitor.service';
import { DatabaseModule } from 'src/database/database.module';
import { EthMonitorProviders } from './eth.monitor.providers';
import { EthMonitorController } from './eth.monitor.controller';
@Module({
  controllers: [EthMonitorController],
  providers: [EthMonitorService, ...EthMonitorProviders],
  exports: [EthMonitorService],
  imports: [DatabaseModule],
})
export class EthWebhookModule {}
