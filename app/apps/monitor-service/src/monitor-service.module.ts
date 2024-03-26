import { Module } from '@nestjs/common';
import { MonitorServiceController } from './monitor-service.controller';
import { MonitorServiceService } from './monitor-service.service';

@Module({
  imports: [],
  controllers: [MonitorServiceController],
  providers: [MonitorServiceService],
})
export class MonitorServiceModule {}
