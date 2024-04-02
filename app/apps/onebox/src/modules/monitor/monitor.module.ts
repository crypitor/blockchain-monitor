import { MonitorModule as MonitorModelModule } from '@app/shared_modules/monitor/monitor.module';
import { Module } from '@nestjs/common';
import { MonitorController } from './monitor.controller';
import { MonitorService } from './monitor.service';
@Module({
  controllers: [MonitorController],
  providers: [MonitorService],
  exports: [MonitorService],
  imports: [MonitorModelModule],
})
export class MonitorModule {}
