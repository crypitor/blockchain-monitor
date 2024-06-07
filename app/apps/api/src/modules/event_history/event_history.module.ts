import { EventHistoryModelModule } from '@app/shared_modules/event_history/event_history.module';
import { Module } from '@nestjs/common';
import { EventHistoryApiController } from './event_history.api.controller';
import { EventHistoryApiService } from './event_history.api.service';
import { MonitorApiModule } from '../monitor/monitor.api.module';
@Module({
  controllers: [EventHistoryApiController],
  providers: [EventHistoryApiService],
  exports: [EventHistoryApiService],
  imports: [EventHistoryModelModule, MonitorApiModule],
})
export class EventHistoryApiModule {}
