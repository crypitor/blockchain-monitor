import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GlobalService } from './global/global.service';
import { DatabaseModule } from './database/database.module';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { GlobalModule } from './global/global.module';
import { ConfigModule } from '@nestjs/config';
import { WalletModule } from './modules/wallet/wallet.module';
import { ERC721Module } from './modules/erc721/erc721.module';
import { SwaggerModule } from '@nestjs/swagger';
import { ScheduleModule } from '@nestjs/schedule';
import { EvmWorker } from './workers/evm.worker';
import { BlockSyncModule } from './modules/blocksync/blocksync.module';
import { MantleWorker } from './workers/mantle.worker';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), DatabaseModule, UsersModule, AuthModule, GlobalModule, WalletModule, BlockSyncModule, ERC721Module, SwaggerModule, ScheduleModule.forRoot()],
  controllers: [AppController],
  providers: [AppService, GlobalService, EvmWorker, MantleWorker],
})
export class AppModule { }
