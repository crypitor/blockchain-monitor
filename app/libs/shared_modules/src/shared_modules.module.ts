import { Module } from '@nestjs/common';
import { BlockHistoryModelModule } from './block_history/block_history.module';
import { BlockSyncModelModule } from './blocksync';
import { EventHistoryModelModule } from './event_history/event_history.module';
import { MonitorModule } from './monitor/monitor.module';
import { ProjectModule } from './project/project.module';
import { SharedModulesService } from './shared_modules.service';
import { WebhookModule } from './webhook/webhook.module';

@Module({
  imports: [
    MonitorModule,
    ProjectModule,
    WebhookModule,
    EventHistoryModelModule,
    BlockHistoryModelModule,
    BlockSyncModelModule,
  ],
  providers: [SharedModulesService],
  exports: [
    SharedModulesService,
    MonitorModule,
    ProjectModule,
    WebhookModule,
    EventHistoryModelModule,
    BlockHistoryModelModule,
    BlockSyncModelModule,
  ],
})
export class SharedModulesModule {}
