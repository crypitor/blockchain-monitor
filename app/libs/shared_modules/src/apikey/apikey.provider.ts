import { Connection } from 'mongoose';
import { ApiKeySchema } from './schemas/apikey.schema';

export const ApiKeyProviders = [
  {
    provide: 'APIKEY_MODEL',
    useFactory: (connection: Connection) =>
      connection.model('ApiKey', ApiKeySchema),
    inject: ['DATABASE_CONNECTION'],
  },
];
