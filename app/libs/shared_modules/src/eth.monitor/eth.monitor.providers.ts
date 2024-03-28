import { Connection } from 'mongoose';
import { EthMonitorSchema } from './schemas/eth.monitor.schema';

export const EthMonitorProviders = [
  {
    provide: 'ETH_MONITOR_MODEL',
    useFactory: (connection: Connection) =>
      connection.model('EthMonitor', EthMonitorSchema),
    inject: ['DATABASE_CONNECTION'],
  },
];
