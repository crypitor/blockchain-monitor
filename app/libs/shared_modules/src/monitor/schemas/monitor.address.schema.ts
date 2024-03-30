import { Prop, Schema } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { MonitorNetwork } from './monitor.schema';

@Schema()
export class MonitorAddress {
  @Prop({ required: true })
  projectId: string;

  @Prop({ required: true, index: true })
  monitorId: string;

  @Prop({ required: true, index: true })
  address: string;

  @Prop({ required: true })
  network: MonitorNetwork;

  @Prop({ required: true })
  createdAt: Date;
}
export type MonitorAddressDocument = HydratedDocument<MonitorAddress>;

export const EthMonitorAddressSchema = new mongoose.Schema(MonitorAddress, {
  collection: 'eth_monitor_address',
});
EthMonitorAddressSchema.index({ monitorId: 1, address: 1 }, { unique: true });
EthMonitorAddressSchema.index({ address: 1, network: 1 });

export const BscMonitorAddressSchema = new mongoose.Schema(MonitorAddress, {
  collection: 'bsc_monitor_address',
});
BscMonitorAddressSchema.index({ monitorId: 1, address: 1 }, { unique: true });
BscMonitorAddressSchema.index({ address: 1, network: 1 });
