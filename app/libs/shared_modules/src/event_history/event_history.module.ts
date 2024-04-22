import { DatabaseModule } from '@app/database';
import { Module } from '@nestjs/common';
import {
  BscEventHistoryRepository,
  EthEventHistoryRepository,
} from './repositories/event_history.repository';
import { EventHistoryProviders } from './event_history.provider';

@Module({
  imports: [DatabaseModule],
  providers: [
    ...EventHistoryProviders,
    EthEventHistoryRepository,
    BscEventHistoryRepository,
  ],
  exports: [
    ...EventHistoryProviders,
    EthEventHistoryRepository,
    BscEventHistoryRepository,
  ],
})
export class EventHistoryModelModule {}
