import { MonitorModule as MonitorModelModule } from '@app/shared_modules/monitor/monitor.module';
import { WebhookModule } from '@app/shared_modules/webhook/webhook.module';
import { Module } from '@nestjs/common';
import { MonitorApiController } from './monitor.api.controller';
import { MonitorApiService } from './monitor.api.service';
@Module({
  controllers: [MonitorApiController],
  providers: [MonitorApiService],
  exports: [MonitorApiService],
  imports: [MonitorModelModule, WebhookModule],
})
export class MonitorApiModule {}
