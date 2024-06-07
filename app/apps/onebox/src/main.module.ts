import { GlobalModule, GlobalService } from '@app/global';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { SwaggerModule } from '@nestjs/swagger';
import { MonitorAddressModule } from './modules/address/address.module';
import { ApiV1Module } from './modules/api/v1/apiv1.module';
import { ApiKeyModule } from './modules/apikey/apikey.module';
import { AuthModule } from './modules/auth/auth.module';
import { BlockSyncModule } from './modules/blocksync/blocksync.module';
import { DeliveryModule } from './modules/delivery/delivery.module';
import { EventHistoryModule } from './modules/event_history/event_history.module';
import { MonitorModule } from './modules/monitor/monitor.module';
import { ProjectModule } from './modules/project/project.module';
import { QuickStartModule } from './modules/quickstart/quickstart.module';
import { UsersModule } from './modules/users/users.module';
import { PollingBlockModule } from './modules/polling.block/polling.block.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [`${process.env.NODE_ENV}.env`, '.env'],
      expandVariables: true,
    }),
    UsersModule,
    AuthModule,
    GlobalModule,
    SwaggerModule,
    ScheduleModule.forRoot(),
    ProjectModule,
    BlockSyncModule,
    MonitorModule,
    MonitorAddressModule,
    DeliveryModule,
    EventHistoryModule,
    QuickStartModule,
    ApiKeyModule,
    ApiV1Module,
    PollingBlockModule,
  ],
  providers: [GlobalService],
})
export class MainModule {}
