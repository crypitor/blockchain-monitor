import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { MonitorNetwork } from './monitor.schema';

@Schema()
export class MonitorAddress {
  @Prop({ required: true })
  projectId: string;

  @Prop({ required: true, index: true })
  monitorId: string;

  @Prop({ required: true, index: true })
  address: string;

  @Prop({ required: true, type: String, enum: MonitorNetwork })
  network: MonitorNetwork;

  @Prop({ required: true })
  createdBy: string;

  @Prop({ required: true, index: -1 })
  dateCreated: Date;
}
export type MonitorAddressDocument = HydratedDocument<MonitorAddress>;

export const MonitorAddressSchema =
  SchemaFactory.createForClass(MonitorAddress);
MonitorAddressSchema.index({ monitorId: 1, address: 1 }, { unique: true });
