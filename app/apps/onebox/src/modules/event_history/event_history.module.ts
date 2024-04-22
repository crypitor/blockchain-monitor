import { EventHistoryModelModule } from '@app/shared_modules/event_history/event_history.module';
import { Module } from '@nestjs/common';
import { MonitorModule } from '../monitor/monitor.module';
import { EventHistoryController } from './event_history.controller';
import { EventHistoryService } from './event_history.service';
@Module({
  controllers: [EventHistoryController],
  providers: [EventHistoryService],
  exports: [EventHistoryService],
  imports: [EventHistoryModelModule, MonitorModule],
})
export class EventHistoryModule {}
