import { Module } from '@nestjs/common';
import { ApiController } from './api.controller';
import { ApiService } from './api.service';
import { ConfigModule } from '@nestjs/config';
import { MonitorApiModule } from './modules/monitor/monitor.api.module';
import { MonitorAddressApiModule } from './modules/address/address.module';
import { PollingBlockModule } from './modules/polling.block/polling.block.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [`${process.env.NODE_ENV}.env`, '.env'],
      expandVariables: true,
    }),
    MonitorApiModule,
    MonitorAddressApiModule,
    PollingBlockModule,
  ],
  controllers: [ApiController],
  providers: [ApiService],
})
export class ApiModule {}
