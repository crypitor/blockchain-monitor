import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { HydratedDocument } from 'mongoose';

export enum MonitoringType {
  IN = 'in',
  OUT = 'out',
  ALL = 'all',
}

export class MonitorCondition {
  @Prop()
  native: boolean;

  @Prop()
  erc721: boolean;

  @Prop()
  erc20: boolean;

  @Prop()
  specific: boolean;

  @Prop({ type: Object })
  cryptos: {
    [key: string]: boolean;
  };

  // ALL = 'ALL', // native, erc20, erc721, erc1155
  // SPECIFIC = 'SPECIFIC', // use for only specific crypto
  // // CUSTOM = 'CUSTOM',
}

export enum Method {
  WEBHOOK = 'webhook',
  SMS = 'sms',
  EMAIL = 'email',
  TELEGRAM = 'telegram',
  DISCORD = 'discord',
}

export class NotificationMethod {
  @IsEnum(Method, { message: 'Invalid notification method' })
  @Prop()
  name: Method;

  @Prop()
  url: string;
}

// note: only apply for purchased user
// tokens not having price will be excluded in when calculating USD value
// filter value in USD
export class FilterValue {
  @Prop()
  min: bigint;
  @Prop()
  max: bigint;
}

export type EthMonitorDocument = HydratedDocument<EthMonitor>;

@Schema()
export class EthMonitor {
  @Prop({ required: true, unique: true })
  monitorId: string;

  @Prop({ required: true, lowercase: true })
  address: string;

  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  condition: MonitorCondition;

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

export const EthMonitorSchema = SchemaFactory.createForClass(EthMonitor);
