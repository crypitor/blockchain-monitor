import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema()
export class BlockHistory {
  @Prop({ index: true })
  blockNum: number;

  @Prop()
  chain: string;

  @Prop()
  confirmed: boolean;

  @Prop({ index: true })
  isError: boolean;

  @Prop()
  errorDetail: string;

  @Prop({ default: Date.now() })
  dateCreated: Date;
}
export type BlockHistoryDocument = HydratedDocument<BlockHistory>;
export const BlockHistorySchema = SchemaFactory.createForClass(BlockHistory);
