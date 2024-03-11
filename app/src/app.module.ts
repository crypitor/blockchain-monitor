import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { SwaggerModule } from '@nestjs/swagger';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { GlobalModule } from './global/global.module';
import { GlobalService } from './global/global.service';
import { AuthModule } from './modules/auth/auth.module';
import { BlockSyncModule } from './modules/blocksync/blocksync.module';
import { ERC721Module } from './modules/erc721/erc721.module';
import { NftModule } from './modules/nft/nft.module';
import { UsersModule } from './modules/users/users.module';
import { WalletModule } from './modules/wallet/wallet.module';
import { EthMonitorModule } from './modules/webhooks/ethereum/eth.monitor.module';
import { EthereumWorker } from './modules/webhooks/ethereum/worker/evm.worker';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    UsersModule,
    AuthModule,
    GlobalModule,
    WalletModule,
    BlockSyncModule,
    ERC721Module,
    SwaggerModule,
    ScheduleModule.forRoot(),
    NftModule,
    EthMonitorModule,
  ],
  controllers: [AppController],
  providers: [AppService, GlobalService, EthereumWorker],
})
export class AppModule {}
