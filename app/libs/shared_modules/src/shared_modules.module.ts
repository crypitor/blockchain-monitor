import { Module } from '@nestjs/common';
import { SharedModulesService } from './shared_modules.service';
import { MonitorModule } from './monitor/monitor.module';
import { ProjectModule } from './project/project.module';

@Module({
  imports: [MonitorModule, ProjectModule],
  providers: [SharedModulesService],
  exports: [SharedModulesService, MonitorModule, ProjectModule],
})
export class SharedModulesModule {}
