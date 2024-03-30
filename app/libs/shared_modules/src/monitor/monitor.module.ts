import { DatabaseModule } from '@app/database';
import { Module } from '@nestjs/common';
import { MonitorProviders } from './monitor.provider';

@Module({
  imports: [DatabaseModule],
  providers: [...MonitorProviders],
  exports: [...MonitorProviders],
})
export class MonitorModule {}
