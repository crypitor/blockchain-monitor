import { DatabaseModule } from '@app/database';
import { Module } from '@nestjs/common';
import { BlockSyncModelModule, BlockSyncProviders } from 'libs';
import { BlockSyncController } from './blocksync.controller';
@Module({
  controllers: [BlockSyncController],
  providers: [...BlockSyncProviders],
  exports: [],
  imports: [DatabaseModule, BlockSyncModelModule],
})
export class BlockSyncModule {}
