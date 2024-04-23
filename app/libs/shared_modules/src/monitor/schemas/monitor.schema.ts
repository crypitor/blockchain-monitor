import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export enum MonitorNetwork {
  Ethereum = 'Ethereum',
  Sepolia = 'Sepolia',
  BSC = 'BSC',
  Polygon = 'Polygon',
  Avalanche = 'Avalanche',
  Arbitrum = 'Arbitrum',
  Optimism = 'Optimism',
  Celo = 'Celo',
  Gnosis = 'Gnosis',
  Moonbeam = 'Moonbeam',
  Moonriver = 'Moonriver',
  Aurora = 'Aurora',
  FTM = 'FTM',
  Heco = 'Heco',
  Harmony = 'Harmony',
  Evmos = 'Evmos',
  Canto = 'Canto',
  Telos = 'Telos',
  Fuse = 'Fuse',
  Klaytn = 'Klaytn',
}

export class MonitorCondition {
  @Prop()
  native: boolean;

  @Prop()
  internal: boolean;

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
}

export enum MonitorNotificationMethod {
  SMS = 'SMS',
  Email = 'Email',
  Webhook = 'Webhook',
  Slack = 'Slack',
  Telegram = 'Telegram',
  Discord = 'Discord',
}

export class MonitorNotification {
  constructor(method: MonitorNotificationMethod) {
    this.method = method;
  }
  @Prop({ enum: MonitorNotificationMethod })
  method: MonitorNotificationMethod;
}

@Schema()
export class Monitor {
  @Prop({ required: true, index: 1 })
  projectId: string;

  @Prop({ required: true, unique: true })
  monitorId: string;

  @Prop({ required: true })
  network: MonitorNetwork;

  @Prop({ required: true })
  name: string;

  @Prop()
  condition: MonitorCondition;

  @Prop()
  notification: MonitorNotification;

  @Prop()
  type: MonitoringType;

  @Prop()
  note: string;

  @Prop()
  tags: string[];

  @Prop()
  createdBy: string;

  @Prop()
  dateCreated: Date;

  @Prop()
  webhookId: string;

  @Prop()
  disabled: boolean;

  @Prop()
  addressCount: number;

  @Prop()
  webhookCount: number;
}
export type MonitorDocument = HydratedDocument<Monitor>;
export const MonitorSchema = SchemaFactory.createForClass(Monitor);

export enum MonitoringType {
  IN = 'in',
  OUT = 'out',
  ALL = 'all',
}

export class SMSNotification extends MonitorNotification {
  constructor() {
    super(MonitorNotificationMethod.SMS);
  }
  @Prop()
  phone: string;
}

export class EmailNotification extends MonitorNotification {
  constructor() {
    super(MonitorNotificationMethod.Email);
  }
  @Prop()
  email: string;
}

export class WebhookNotification extends MonitorNotification {
  constructor() {
    super(MonitorNotificationMethod.Webhook);
  }
  @Prop()
  url: string;

  @Prop()
  secret_token: string;

  @Prop()
  authorization: string;
}

export class SlackNotification extends MonitorNotification {
  constructor() {
    super(MonitorNotificationMethod.Slack);
  }
  @Prop()
  url: string;
}

export class TelegramNotification extends MonitorNotification {
  constructor() {
    super(MonitorNotificationMethod.Telegram);
  }
  @Prop()
  url: string;
}

export class DiscordNotification extends MonitorNotification {
  constructor() {
    super(MonitorNotificationMethod.Discord);
  }
  @Prop()
  url: string;
}
