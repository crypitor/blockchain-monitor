import { DatabaseModule } from '@app/database';
import { Module } from '@nestjs/common';
import { MonitorAddressModule } from '../address/address.module';
import { AuthModule } from '../auth/auth.module';
import { MonitorModule } from '../monitor/monitor.module';
import { ProjectModule } from '../project/project.module';
import { UsersModule } from '../users/users.module';
import { UsersProviders } from '../users/users.providers';
import { QuickstartController } from './quickstart.controller';
import { QuickStartService } from './quickstart.service';
@Module({
  controllers: [QuickstartController],
  providers: [QuickStartService, ...UsersProviders],
  exports: [QuickStartService],
  imports: [
    DatabaseModule,
    UsersModule,
    ProjectModule,
    MonitorModule,
    MonitorAddressModule,
    AuthModule,
  ],
})
export class QuickStartModule {}
