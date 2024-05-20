import { DatabaseModule } from '@app/database';
import { Module } from '@nestjs/common';
import {
  AvaxBlockHistoryRepository,
  BscBlockHistoryRepository,
  EthBlockHistoryRepository,
  MantleBlockHistoryRepository,
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
    AvaxBlockHistoryRepository,
    MantleBlockHistoryRepository,
  ],
  exports: [
    ...BlockHistoryProviders,
    EthBlockHistoryRepository,
    BscBlockHistoryRepository,
    PolygonBlockHistoryRepository,
    AvaxBlockHistoryRepository,
    MantleBlockHistoryRepository,
  ],
})
export class BlockHistoryModelModule {}
