import * as mongoose from 'mongoose';

export const Database = [
  {
    provide: 'DATABASE_CONNECTION',
    useFactory: (): mongoose.Connection => {
      if (process.env.DB_URL) {
        return mongoose.createConnection(process.env.DB_URL);
      } else {
        return mongoose.createConnection(
          `mongodb://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}/${process.env.DB_DATABASE_NAME}?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+1.5.0`,
        );
      }
    },
  },
  // {
  //   provide: 'DATABASE_USER_CONNECTION',
  //   useFactory: (): mongoose.Connection =>
  //     mongoose.createConnection(process.env.DB_USER_URL),
  // },
  // {
  //   provide: 'DATABASE_SPACES_CONNECTION',
  //   useFactory: (): mongoose.Connection =>
  //     mongoose.createConnection(process.env.DB_SPACES_URL),
  // },
  // {
  //   provide: 'DATABASE_ITEMS_CONNECTION',
  //   useFactory: (): mongoose.Connection =>
  //     mongoose.createConnection(process.env.DB_ITEMS_URL),
  // },
];
