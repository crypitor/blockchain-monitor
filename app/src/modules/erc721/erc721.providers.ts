import { Connection } from 'mongoose';
import { ERC721Schema } from './schemas/erc721.schema';

export const ERC721Providers = [
  {
    provide: 'ERC721_MODEL',
    useFactory: (connection: Connection) =>
      connection.model('ERC721', ERC721Schema),
    inject: ['DATABASE_ERC721_CONNECTION'],
  },
];
