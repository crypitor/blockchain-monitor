import { DatabaseModule } from '@app/database';
import { Module } from '@nestjs/common';
import { BlockSyncProviders } from './blocksync.providers';
import { BlockSyncRepository } from './repositories/blocksync.repository';
@Module({
  controllers: [],
  providers: [BlockSyncRepository, ...BlockSyncProviders],
  exports: [BlockSyncRepository],
  imports: [DatabaseModule],
})
export class BlockSyncModelModule {}
