import { Module } from '@nestjs/common';
import { EthMonitorService } from './eth.monitor.service';
import { EthMonitorController } from './eth.monitor.controller';
import { DatabaseModule } from '@app/database';
import { SharedModulesModule } from '@app/shared_modules';
@Module({
  controllers: [EthMonitorController],
  providers: [EthMonitorService],
  exports: [EthMonitorService],
  imports: [DatabaseModule, SharedModulesModule],
})
export class EthMonitorModule {}
