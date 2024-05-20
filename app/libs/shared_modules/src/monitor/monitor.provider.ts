import { Connection } from 'mongoose';
import { MonitorAddressSchema } from './schemas/monitor.address.schema';
import { MonitorSchema } from './schemas/monitor.schema';

export const MonitorProviders = [
  {
    provide: 'MONITOR_MODEL',
    useFactory: (connection: Connection) =>
      connection.model('Monitor', MonitorSchema),
    inject: ['DATABASE_CONNECTION'],
  },
  {
    provide: 'ETH_MONITOR_ADDRESS_MODEL',
    useFactory: (connection: Connection) =>
      connection.model(
        'EthMonitorAddress',
        MonitorAddressSchema,
        'eth_monitor_address',
      ),
    inject: ['DATABASE_CONNECTION'],
  },
  {
    provide: 'BSC_MONITOR_ADDRESS_MODEL',
    useFactory: (connection: Connection) =>
      connection.model(
        'BscMonitorAddress',
        MonitorAddressSchema,
        'bsc_monitor_address',
      ),
    inject: ['DATABASE_CONNECTION'],
  },
  {
    provide: 'POLYGON_MONITOR_ADDRESS_MODEL',
    useFactory: (connection: Connection) =>
      connection.model(
        'PolygonMonitorAddress',
        MonitorAddressSchema,
        'polygon_monitor_address',
      ),
    inject: ['DATABASE_CONNECTION'],
  },
  {
    provide: 'AVAX_MONITOR_ADDRESS_MODEL',
    useFactory: (connection: Connection) =>
      connection.model(
        'AvaxMonitorAddress',
        MonitorAddressSchema,
        'avax_monitor_address',
      ),
    inject: ['DATABASE_CONNECTION'],
  },
  {
    provide: 'MANTLE_MONITOR_ADDRESS_MODEL',
    useFactory: (connection: Connection) =>
      connection.model(
        'MantleMonitorAddress',
        MonitorAddressSchema,
        'mantle_monitor_address',
      ),
    inject: ['DATABASE_CONNECTION'],
  },
];
