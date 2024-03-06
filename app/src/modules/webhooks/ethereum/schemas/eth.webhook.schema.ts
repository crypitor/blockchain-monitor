import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export enum MonitoringType {
  IN = 'IN',
  OUT = 'OUT',
  ALL = 'ALL',
}

export enum MonitoringCondition {
  ALL = 'ALL', // native, erc20, erc721, erc1155
  SPECIFIC = 'SPECIFIC', // use for only specific crypto
  // CUSTOM = 'CUSTOM',
}

export enum Method {
  WEBHOOK = 'WEBHOOK',
  SMS = 'SMS',
  EMAIL = 'EMAIL',
  TELEGRAM = 'TELEGRAM',
  DISCORD = 'DISCORD',
}

export class NotificationMethod {
  name: Method;
  url: string;
}

// note: only apply for purchased user
// tokens not having price will be excluded in when calculating USD value
// filter value in USD
export class FilterValue {
  min: bigint;
  max: bigint;
}

export type EthWebhookDocument = HydratedDocument<EthWebhook>;

@Schema()
export class EthWebhook {
  @Prop({ required: true, unique: true })
  webhookId: string;

  @Prop({ required: true, lowercase: true })
  address: string;

  @Prop({ required: true })
  userId: string;

  @Prop({ default: MonitoringCondition.ALL })
  condition: MonitoringCondition;

  @Prop({ default: [] })
  crypto: [];

  @Prop({ default: MonitoringType.ALL })
  type: MonitoringType;

  @Prop({ required: true })
  notificationMethods: NotificationMethod[];

  @Prop({ required: false })
  filter: FilterValue;

  @Prop({ require: false, maxlength: 200 })
  note: string;

  @Prop({ default: Date.now() })
  dateCreated: Date;
}

export const EthWebhookSchema = SchemaFactory.createForClass(EthWebhook);
