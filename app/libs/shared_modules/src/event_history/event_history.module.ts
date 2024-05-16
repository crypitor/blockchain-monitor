import { DatabaseModule } from '@app/database';
import { Module } from '@nestjs/common';
import {
  AvaxEventHistoryRepository,
  BscEventHistoryRepository,
  EthEventHistoryRepository,
  PolygonEventHistoryRepository,
} from './repositories/event_history.repository';
import { EventHistoryProviders } from './event_history.provider';

@Module({
  imports: [DatabaseModule],
  providers: [
    ...EventHistoryProviders,
    EthEventHistoryRepository,
    BscEventHistoryRepository,
    PolygonEventHistoryRepository,
    AvaxEventHistoryRepository,
  ],
  exports: [
    ...EventHistoryProviders,
    EthEventHistoryRepository,
    BscEventHistoryRepository,
    PolygonEventHistoryRepository,
    AvaxEventHistoryRepository,
  ],
})
export class EventHistoryModelModule {}
