import { Module } from '@nestjs/common';
import { TransactionHistoryService } from './transaction_history.service';

@Module({
  providers: [TransactionHistoryService],
})
export class TransactionHistoryModule {}
