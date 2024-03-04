import { Connection } from 'mongoose';
import { EthWebhookSchema } from './schemas/eth.webhook.schema';

export const EthWebhookProviders = [
  {
    provide: 'ETH_WEBHOOK_MODEL',
    useFactory: (connection: Connection) =>
      connection.model('EthWebhook', EthWebhookSchema),
    inject: ['DATABASE_CONNECTION'],
  },
];
