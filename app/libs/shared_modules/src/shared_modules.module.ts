import { Module } from '@nestjs/common';
import { SharedModulesService } from './shared_modules.service';
import { MonitorModule } from './monitor/monitor.module';
import { ProjectModule } from './project/project.module';
import { WebhookModule } from './webhook/webhook.module';
import { EventHistoryModelModule } from './event_history/event_history.module';

@Module({
  imports: [
    MonitorModule,
    ProjectModule,
    WebhookModule,
    EventHistoryModelModule,
  ],
  providers: [SharedModulesService],
  exports: [
    SharedModulesService,
    MonitorModule,
    ProjectModule,
    WebhookModule,
    EventHistoryModelModule,
  ],
})
export class SharedModulesModule {}
