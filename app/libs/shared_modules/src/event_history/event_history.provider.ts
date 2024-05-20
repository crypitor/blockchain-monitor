import { Connection } from 'mongoose';
import { EventHistorySchema } from './schemas/event_history.schema';

export const EventHistoryProviders = [
  {
    provide: 'ETH_EVENT_HISTORY_MODEL',
    useFactory: (connection: Connection) =>
      connection.model(
        'EthEventHistory',
        EventHistorySchema,
        'eth_event_history',
      ),
    inject: ['DATABASE_CONNECTION'],
  },
  {
    provide: 'BSC_EVENT_HISTORY_MODEL',
    useFactory: (connection: Connection) =>
      connection.model(
        'BscEventHistory',
        EventHistorySchema,
        'bsc_event_history',
      ),
    inject: ['DATABASE_CONNECTION'],
  },
  {
    provide: 'POLYGON_EVENT_HISTORY_MODEL',
    useFactory: (connection: Connection) =>
      connection.model(
        'PolygonEventHistory',
        EventHistorySchema,
        'polygon_event_history',
      ),
    inject: ['DATABASE_CONNECTION'],
  },
  {
    provide: 'AVAX_EVENT_HISTORY_MODEL',
    useFactory: (connection: Connection) =>
      connection.model(
        'AvaxEventHistory',
        EventHistorySchema,
        'avax_event_history',
      ),
    inject: ['DATABASE_CONNECTION'],
  },
  {
    provide: 'MANTLE_EVENT_HISTORY_MODEL',
    useFactory: (connection: Connection) =>
      connection.model(
        'MantleEventHistory',
        EventHistorySchema,
        'mantle_event_history',
      ),
    inject: ['DATABASE_CONNECTION'],
  },
];
