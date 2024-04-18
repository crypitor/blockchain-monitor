import { Module } from '@nestjs/common';
import { SharedModulesService } from './shared_modules.service';
import { MonitorModule } from './monitor/monitor.module';
import { ProjectModule } from './project/project.module';
import { WebhookModule } from './webhook/webhook.module';
import { TransactionHistoryModule } from './transaction_history/transaction_history.module';

@Module({
  imports: [
    MonitorModule,
    ProjectModule,
    WebhookModule,
    TransactionHistoryModule,
  ],
  providers: [SharedModulesService],
  exports: [SharedModulesService, MonitorModule, ProjectModule, WebhookModule],
})
export class SharedModulesModule {}
