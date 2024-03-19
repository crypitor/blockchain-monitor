import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { DatabaseModule } from 'src/database/database.module';
import { GlobalModule } from 'src/global/global.module';
import { GlobalService } from 'src/global/global.service';
import { AuthModule } from 'src/modules/auth/auth.module';
import { BlockSyncModule } from 'src/modules/blocksync/blocksync.module';
import { ERC721Module } from 'src/modules/erc721/erc721.module';
import { NftModule } from 'src/modules/nft/nft.module';
import { UsersModule } from 'src/modules/users/users.module';
import { WalletModule } from 'src/modules/wallet/wallet.module';
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
    UsersModule,
    AuthModule,
    GlobalModule,
    WalletModule,
    BlockSyncModule,
    ERC721Module,
    ScheduleModule.forRoot(),
    NftModule,
    EthMonitorModule,
  ],
  providers: [GlobalService, EthereumWorker],
})
export class ScannerModule {}
