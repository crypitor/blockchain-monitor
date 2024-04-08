import { MonitorModule as MonitorModelModule } from '@app/shared_modules/monitor/monitor.module';
import { ProjectModule as ProjectModelModule } from '@app/shared_modules/project/project.module';
import { Module } from '@nestjs/common';
import { MonitorController } from './monitor.controller';
import { MonitorService } from './monitor.service';
import { WebhookModule } from '@app/shared_modules/webhook/webhook.module';
@Module({
  controllers: [MonitorController],
  providers: [MonitorService],
  exports: [MonitorService],
  imports: [MonitorModelModule, ProjectModelModule, WebhookModule],
})
export class MonitorModule {}
