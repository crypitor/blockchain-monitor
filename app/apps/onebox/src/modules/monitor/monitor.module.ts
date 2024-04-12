import { MonitorModule as MonitorModelModule } from '@app/shared_modules/monitor/monitor.module';
import { ProjectModule as ProjectModelModule } from '@app/shared_modules/project/project.module';
import { WebhookModule } from '@app/shared_modules/webhook/webhook.module';
import { Module } from '@nestjs/common';
import { ProjectModule } from '../project/project.module';
import { MonitorController } from './monitor.controller';
import { MonitorService } from './monitor.service';
@Module({
  controllers: [MonitorController],
  providers: [MonitorService],
  exports: [MonitorService],
  imports: [
    MonitorModelModule,
    ProjectModelModule,
    WebhookModule,
    ProjectModule,
  ],
})
export class MonitorModule {}
