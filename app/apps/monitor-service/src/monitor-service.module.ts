import { DatabaseModule } from '@app/database';
import { GlobalModule } from '@app/global';
import { SharedModulesModule } from '@app/shared_modules';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
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
    SharedModulesModule,
  ],
  controllers: [MonitorServiceController],
  providers: [MonitorServiceService],
})
export class MonitorServiceModule {}
