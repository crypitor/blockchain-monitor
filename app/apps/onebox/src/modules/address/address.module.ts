import { MonitorModule as MonitorModelModule } from '@app/shared_modules/monitor/monitor.module';
import { ProjectModule as ProjectModelModule } from '@app/shared_modules/project/project.module';
import { Module } from '@nestjs/common';
import { MonitorModule } from '../monitor/monitor.module';
import { MonitorAddressController } from './address.controller';
import { MonitorAddressService } from './address.service';

@Module({
  controllers: [MonitorAddressController],
  providers: [MonitorAddressService],
  exports: [MonitorAddressService],
  imports: [MonitorModelModule, ProjectModelModule, MonitorModule],
})
export class MonitorAddressModule {}
