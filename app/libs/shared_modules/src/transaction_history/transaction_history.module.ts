import { DatabaseModule } from '@app/database';
import { Module } from '@nestjs/common';
import {
  BscTransactionHistoryRepository,
  EthTransactionHistoryRepository,
} from './repositories/transaction_history.repository';
import { TransactionHistoryProviders } from './transaction_history.provider';

@Module({
  imports: [DatabaseModule],
  providers: [
    ...TransactionHistoryProviders,
    EthTransactionHistoryRepository,
    BscTransactionHistoryRepository,
  ],
  exports: [
    ...TransactionHistoryProviders,
    EthTransactionHistoryRepository,
    BscTransactionHistoryRepository,
  ],
})
export class TransactionHistoryModule {}
