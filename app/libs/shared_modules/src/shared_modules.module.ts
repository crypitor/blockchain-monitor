import { Module } from '@nestjs/common';
import { SharedModulesService } from './shared_modules.service';
import { MonitorModule } from './monitor/monitor.module';
import { ProjectModule } from './project/project.module';
import { WebhookModule } from './webhook/webhook.module';
import { EventHistoryModule } from './event_history/event_history.module';

@Module({
  imports: [MonitorModule, ProjectModule, WebhookModule, EventHistoryModule],
  providers: [SharedModulesService],
  exports: [SharedModulesService, MonitorModule, ProjectModule, WebhookModule],
})
export class SharedModulesModule {}
