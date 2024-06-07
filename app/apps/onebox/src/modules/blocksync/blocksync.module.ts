import { DatabaseModule } from '@app/database';
import { Module } from '@nestjs/common';
import {
  BlockSyncModelModule,
  BlockSyncProviders,
  BlockSyncRepository,
} from 'libs';
import { BlockSyncController } from './blocksync.controller';
@Module({
  controllers: [BlockSyncController],
  providers: [BlockSyncRepository, ...BlockSyncProviders],
  exports: [],
  imports: [DatabaseModule, BlockSyncModelModule],
})
export class BlockSyncModule {}
