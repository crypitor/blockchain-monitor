import { MonitorModule as MonitorModelModule } from '@app/shared_modules/monitor/monitor.module';
import { ProjectModule as ProjectModelModule } from '@app/shared_modules/project/project.module';
import { WebhookModule } from '@app/shared_modules/webhook/webhook.module';
import { Module } from '@nestjs/common';
import { DeliveryApiController } from './delivery.api.controller';
import { DeliveryApiService } from './delivery.api.service';
import { MonitorApiModule } from '../monitor/monitor.api.module';
@Module({
  controllers: [DeliveryApiController],
  providers: [DeliveryApiService],
  exports: [DeliveryApiService],
  imports: [
    WebhookModule,
    ProjectModelModule,
    MonitorModelModule,
    MonitorApiModule,
  ],
})
export class DeliveryApiModule {}
