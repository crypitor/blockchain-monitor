import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EthereumModule } from './ethereum/ethereum.module';
import { MonitorServiceController } from './monitor-service.controller';
import { PolygonModule } from './polygon/polygon.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [`${process.env.NODE_ENV}.env`, '.env'],
      expandVariables: true,
    }),
    EthereumModule,
    PolygonModule,
  ],
  controllers: [MonitorServiceController],
  providers: [],
})
export class MonitorServiceModule {}
