import { MonitorModule as MonitorModelModule } from '@app/shared_modules/monitor/monitor.module';
import { ProjectModule as ProjectModelModule } from '@app/shared_modules/project/project.module';
import { WebhookModule } from '@app/shared_modules/webhook/webhook.module';
import { Module } from '@nestjs/common';
import { MonitorModule } from '../monitor/monitor.module';
import { ProjectModule } from '../project/project.module';
import { DeliveryController } from './delivery.controller';
import { DeliveryService } from './delivery.service';
@Module({
  controllers: [DeliveryController],
  providers: [DeliveryService],
  exports: [DeliveryService],
  imports: [
    WebhookModule,
    ProjectModelModule,
    MonitorModelModule,
    ProjectModule,
    MonitorModule,
  ],
})
export class DeliveryModule {}
