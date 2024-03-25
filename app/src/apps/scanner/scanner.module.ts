import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { DatabaseModule } from 'src/database/database.module';
import { GlobalModule } from 'src/global/global.module';
import { GlobalService } from 'src/global/global.service';
import { BlockSyncModule } from 'src/modules/blocksync/blocksync.module';
import { EthMonitorModule } from 'src/modules/webhooks/ethereum/eth.monitor.module';
import { EthereumWorker } from 'src/modules/webhooks/ethereum/worker/evm.worker';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [`${process.env.NODE_ENV}.env`, '.env'],
      expandVariables: true,
    }),
    DatabaseModule,
    GlobalModule,
    BlockSyncModule,
    ScheduleModule.forRoot(),
    EthMonitorModule,
  ],
  providers: [GlobalService, EthereumWorker],
})
export class ScannerModule {}
