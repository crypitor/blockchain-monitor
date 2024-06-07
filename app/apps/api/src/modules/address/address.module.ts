import { MonitorModule as MonitorModelModule } from '@app/shared_modules/monitor/monitor.module';
import { ProjectModule as ProjectModelModule } from '@app/shared_modules/project/project.module';
import { Module } from '@nestjs/common';
import { MonitorAddressController } from './address.controller';
import { MonitorAddressApiService } from './address.service';
import { MonitorApiModule } from '../monitor/monitor.api.module';

@Module({
  controllers: [MonitorAddressController],
  providers: [MonitorAddressApiService],
  exports: [MonitorAddressApiService],
  imports: [MonitorModelModule, ProjectModelModule, MonitorApiModule],
})
export class MonitorAddressApiModule {}
