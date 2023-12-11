import { Connection } from 'mongoose';
import { WalletSchema } from 'src/modules/wallet/schemas/wallet.schema';

export const WalletProviders = [
  {
    provide: 'WALLET_MODEL',
    useFactory: (connection: Connection) =>
      connection.model('Wallet', WalletSchema),
    inject: ['DATABASE_CONNECTION'],
  },
];
