import { Connection } from 'mongoose';
import { BlockHistorySchema } from './schemas/block_history.schema';

export const BlockHistoryProviders = [
  {
    provide: 'ETH_BLOCK_HISTORY_MODEL',
    useFactory: (connection: Connection) =>
      connection.model(
        'EthBlockHistory',
        BlockHistorySchema,
        'eth_block_history',
      ),
    inject: ['DATABASE_CONNECTION'],
  },
  {
    provide: 'BSC_BLOCK_HISTORY_MODEL',
    useFactory: (connection: Connection) =>
      connection.model(
        'BscBlockHistory',
        BlockHistorySchema,
        'bsc_block_history',
      ),
    inject: ['DATABASE_CONNECTION'],
  },
  {
    provide: 'POLYGON_BLOCK_HISTORY_MODEL',
    useFactory: (connection: Connection) =>
      connection.model(
        'PolygonBlockHistory',
        BlockHistorySchema,
        'polygon_block_history',
      ),
    inject: ['DATABASE_CONNECTION'],
  },
  {
    provide: 'AVAX_BLOCK_HISTORY_MODEL',
    useFactory: (connection: Connection) =>
      connection.model(
        'AvaxBlockHistory',
        BlockHistorySchema,
        'avax_block_history',
      ),
    inject: ['DATABASE_CONNECTION'],
  },
];
