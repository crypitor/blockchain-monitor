import { DatabaseModule } from '@app/database';
import { MonitorModule } from '@app/shared_modules/monitor/monitor.module';
import { Module } from '@nestjs/common';
import { ProjectModule } from '../project/project.module';
import { UsersController } from './users.controller';
import { UsersProviders } from './users.providers';
import { UsersService } from './users.service';
@Module({
  controllers: [UsersController],
  providers: [UsersService, ...UsersProviders],
  exports: [UsersService],
  imports: [DatabaseModule, ProjectModule, MonitorModule],
})
export class UsersModule {}
