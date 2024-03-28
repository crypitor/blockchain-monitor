import { DatabaseModule } from '@app/database';
import { Module } from '@nestjs/common';
import { BlockSyncProviders } from './blocksync.providers';
import { BlockSyncService } from './blocksync.service';
@Module({
  controllers: [],
  providers: [BlockSyncService, ...BlockSyncProviders],
  exports: [BlockSyncService],
  imports: [DatabaseModule],
})
export class BlockSyncModule {}
