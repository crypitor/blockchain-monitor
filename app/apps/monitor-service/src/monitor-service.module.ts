import { DatabaseModule } from '@app/database';
import { GlobalModule } from '@app/global';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EthMonitorModule } from 'apps/onebox/src/modules/webhooks/ethereum/eth.monitor.module';
import { MonitorServiceController } from './monitor-service.controller';
import { MonitorServiceService } from './monitor-service.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [`${process.env.NODE_ENV}.env`, '.env'],
      expandVariables: true,
    }),
    DatabaseModule,
    GlobalModule,
    EthMonitorModule,
  ],
  controllers: [MonitorServiceController],
  providers: [MonitorServiceService],
})
export class MonitorServiceModule {}
