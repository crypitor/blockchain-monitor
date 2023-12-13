import { Module } from '@nestjs/common';
import { BlockSyncService } from './blocksync.service';
import { DatabaseModule } from 'src/database/database.module';
import { BlockSyncProviders } from './blocksync.providers';
import { BlockSyncController } from './blocksync.controller';
@Module({
  controllers: [],
  providers: [BlockSyncService, ...BlockSyncProviders],
  exports: [BlockSyncService],
  imports: [DatabaseModule],
})
export class BlockSyncModule {}
