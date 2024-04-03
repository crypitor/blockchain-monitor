import { DatabaseModule } from '@app/database';
import { GlobalModule } from '@app/global';
import { SharedModulesModule } from '@app/shared_modules';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MonitorServiceController } from './monitor-service.controller';
import { EthereumModule } from './ethereum/ethereum.module';
import { EthereumService } from './ethereum/ethereum.service';

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
    EthereumModule,
  ],
  controllers: [MonitorServiceController],
  providers: [EthereumService],
})
export class MonitorServiceModule {}
