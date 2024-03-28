import { Module } from '@nestjs/common';
import { SharedModulesService } from './shared_modules.service';
import { EthMonitorModule } from './eth.monitor/eth.monitor.module';

@Module({
  imports: [EthMonitorModule],
  providers: [SharedModulesService],
  exports: [SharedModulesService, EthMonitorModule],
})
export class SharedModulesModule {}
