import { Module } from '@nestjs/common';
import { EthMonitorService } from './eth.monitor.service';
import { EthMonitorProviders } from './eth.monitor.providers';
import { EthMonitorController } from './eth.monitor.controller';
import { DatabaseModule } from '@app/database';
@Module({
  controllers: [EthMonitorController],
  providers: [EthMonitorService, ...EthMonitorProviders],
  exports: [EthMonitorService],
  imports: [DatabaseModule],
})
export class EthMonitorModule {}
