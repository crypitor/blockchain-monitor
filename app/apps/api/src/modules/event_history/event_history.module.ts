import { EventHistoryModelModule } from '@app/shared_modules/event_history/event_history.module';
import { Module } from '@nestjs/common';
import { EventHistoryController } from './event_history.api.controller';
import { EventHistoryService } from './event_history.api.service';
import { MonitorApiModule } from '../monitor/monitor.api.module';
@Module({
  controllers: [EventHistoryController],
  providers: [EventHistoryService],
  exports: [EventHistoryService],
  imports: [EventHistoryModelModule, MonitorApiModule],
})
export class EventHistoryApiModule {}
