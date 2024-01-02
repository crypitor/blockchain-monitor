import * as dotenv from 'dotenv';
dotenv.config();

export const jwtConstants = {
  secret: process.env.SECRET_KEY,
};
