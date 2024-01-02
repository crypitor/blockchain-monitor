import { Connection } from 'mongoose';
import { BlockSyncSchema } from './schemas/blocksync.schema';

export const BlockSyncProviders = [
  {
    provide: 'BLOCKSYNC_MODEL',
    useFactory: (connection: Connection) =>
      connection.model('BlockSync', BlockSyncSchema),
    inject: ['DATABASE_CONNECTION'],
  },
];
