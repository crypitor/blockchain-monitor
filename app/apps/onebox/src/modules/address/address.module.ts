import { MonitorModule as MonitorModelModule } from '@app/shared_modules/monitor/monitor.module';
import { ProjectModule as ProjectModelModule } from '@app/shared_modules/project/project.module';
import { Module } from '@nestjs/common';
import { MonitorAddressController } from './address.controller';
import { MonitorAddressService } from './address.service';

@Module({
  controllers: [MonitorAddressController],
  providers: [MonitorAddressService],
  exports: [MonitorAddressService],
  imports: [MonitorModelModule, ProjectModelModule],
})
export class MonitorAddressModule {}
