import { Connection } from 'mongoose';
import {
  BscMonitorAddressSchema,
  EthMonitorAddressSchema,
} from './schemas/monitor.address.schema';
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
      connection.model('EthMonitorAddress', EthMonitorAddressSchema),
    inject: ['DATABASE_CONNECTION'],
  },
  {
    provide: 'BSC_MONITOR_ADDRESS_MODEL',
    useFactory: (connection: Connection) =>
      connection.model('BscMonitorAddress', BscMonitorAddressSchema),
    inject: ['DATABASE_CONNECTION'],
  },
];
