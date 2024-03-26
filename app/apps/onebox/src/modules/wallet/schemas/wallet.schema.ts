import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type WalletDocument = HydratedDocument<Wallet>;

@Schema()
export class Wallet {
  @Prop({ required: true, unique: true, lowercase: true })
  address: string;

  @Prop()
  webhookUrl: string;

  @Prop({ default: Date.now() })
  dateCreated: Date;
}

export const WalletSchema = SchemaFactory.createForClass(Wallet);
