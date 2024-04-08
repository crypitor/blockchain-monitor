import { Module } from '@nestjs/common';
import { SharedModulesService } from './shared_modules.service';
import { MonitorModule } from './monitor/monitor.module';
import { ProjectModule } from './project/project.module';
import { WebhookModule } from './webhook/webhook.module';

@Module({
  imports: [MonitorModule, ProjectModule, WebhookModule],
  providers: [SharedModulesService],
  exports: [SharedModulesService, MonitorModule, ProjectModule, WebhookModule],
})
export class SharedModulesModule {}
