import { DatabaseModule } from '@app/database';
import { Module } from '@nestjs/common';
import {
  BscBlockHistoryRepository,
  EthBlockHistoryRepository,
  PolygonBlockHistoryRepository,
} from './repositories/block_history.repository';
import { BlockHistoryProviders } from './block_history.provider';

@Module({
  imports: [DatabaseModule],
  providers: [
    ...BlockHistoryProviders,
    EthBlockHistoryRepository,
    BscBlockHistoryRepository,
    PolygonBlockHistoryRepository,
  ],
  exports: [
    ...BlockHistoryProviders,
    EthBlockHistoryRepository,
    BscBlockHistoryRepository,
    PolygonBlockHistoryRepository,
  ],
})
export class BlockHistoryModelModule {}
