import { Module } from '@nestjs/common';
import { ApiController } from './api.controller';
import { ApiService } from './api.service';
import { ConfigModule } from '@nestjs/config';
import { MonitorApiModule } from './modules/monitor/monitor.api.module';
import { MonitorAddressApiModule } from './modules/address/address.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [`${process.env.NODE_ENV}.env`, '.env'],
      expandVariables: true,
    }),
    MonitorApiModule,
    MonitorAddressApiModule,
  ],
  controllers: [ApiController],
  providers: [ApiService],
})
export class ApiModule {}
