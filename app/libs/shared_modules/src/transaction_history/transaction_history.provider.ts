import { Connection } from 'mongoose';
import { TransactionHistorySchema } from './schemas/transaction_history.schema';

export const TransactionHistoryProviders = [
  {
    provide: 'ETH_TRANSACTION_HISTORY_MODEL',
    useFactory: (connection: Connection) =>
      connection.model(
        'EthTransactionHistory',
        TransactionHistorySchema,
        'eth_transaction_history',
      ),
    inject: ['DATABASE_CONNECTION'],
  },
];
