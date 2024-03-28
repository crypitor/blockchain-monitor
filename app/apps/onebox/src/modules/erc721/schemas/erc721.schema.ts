import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ERC721Document = HydratedDocument<ERC721>;

@Schema()
export class ERC721 {
  @Prop({ required: true, unique: true, lowercase: true })
  token_address: string;

  @Prop()
  name: string;

  @Prop()
  symbol: string;

  @Prop({ default: Date.now() })
  dateCreated: Date;
}

export const ERC721Schema = SchemaFactory.createForClass(ERC721);
