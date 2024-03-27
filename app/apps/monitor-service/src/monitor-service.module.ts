import { Module } from '@nestjs/common';
import { MonitorServiceController } from './monitor-service.controller';
import { MonitorServiceService } from './monitor-service.service';
import { ConfigModule } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [`${process.env.NODE_ENV}.env`, '.env'],
      expandVariables: true,
    }),
  ],
  controllers: [MonitorServiceController],
  providers: [MonitorServiceService],
})
export class MonitorServiceModule {}
