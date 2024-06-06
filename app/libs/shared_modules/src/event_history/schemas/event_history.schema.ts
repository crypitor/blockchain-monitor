import { hashMd5 } from '../../../../utils/src';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Log, TransactionResponse, ethers } from 'ethers';
import { HydratedDocument } from 'mongoose';

export enum WebhookCategory {
  ERC721 = 'ERC721',
  Native = 'Native',
  ERC20 = 'ERC20',
  INTERNAL = 'INTERNAL',
}

export enum WebhookType {
  in = 'in',
  out = 'out',
}
@Schema()
export class EventHistory {
  @Prop({ required: true, unique: true })
  eventId: string; // md5 of message exclude timestamp and confirm

  @Prop()
  chain: string;

  @Prop({ required: true, index: 1 })
  monitorId: string;

  @Prop()
  associatedAddress: string;

  @Prop()
  hash: string;

  @Prop()
  blockNumber: number; // decimal string

  @Prop({ type: Object })
  contract: {
    address: string;
    name: string;
    symbol: string;
  };

  @Prop()
  fromAddress: string;

  @Prop()
  toAddress: string;

  @Prop()
  tokenId: string; // decimal string

  @Prop()
  tokenValue: string; // decimal string

  @Prop()
  nativeAmount: string; // decimal string

  @Prop()
  type: WebhookType;

  @Prop()
  confirm: boolean;

  @Prop()
  category: WebhookCategory;

  @Prop({ type: Object })
  rawLog: {
    topics: string[];
    data: string;
  };

  @Prop()
  logIndex: number;

  @Prop()
  txnIndex: number;

  @Prop()
  tags: string[];

  @Prop({ required: true, index: -1 })
  dateCreated: Date;

  @Prop()
  deliveryIds: string[];

  toString(): string {
    return JSON.stringify(this);
  }

  private generateId(): string {
    const data = {
      chain: this.chain,
      monitorId: this.monitorId,
      associatedAddress: this.associatedAddress,
      hash: this.hash,
      blockNumber: this.blockNumber,
      contract: this.contract,
      fromAddress: this.fromAddress,
      toAddress: this.toAddress,
      tokenId: this.tokenId,
      tokenValue: this.tokenValue,
      nativeAmount: this.nativeAmount,
      type: this.type,
      category: this.category,
      rawLog: this.rawLog,
      logIndex: this.logIndex,
      txnIndex: this.txnIndex,
    };
    return hashMd5(JSON.stringify(data));
  }

  public static fromLogToERC20(
    log: Log,
    chain: string,
    monitorId: string,
    type: WebhookType,
    confirm: boolean,
    tokenValue: string,
  ): EventHistory {
    const instance = new EventHistory();
    instance.chain = chain;
    instance.monitorId = monitorId;
    instance.hash = log.transactionHash;
    instance.blockNumber = log.blockNumber;
    instance.contract = {
      address: ethers.getAddress(log.address).toLowerCase(),
      name: null,
      symbol: null,
    };
    instance.fromAddress = ethers
      .getAddress(`0x${log.topics[1].substring(26)}`)
      .toLowerCase();
    instance.toAddress = ethers
      .getAddress(`0x${log.topics[2].substring(26)}`)
      .toLowerCase();
    // instance.tokenId = '0';
    instance.tokenValue = tokenValue;
    // instance.nativeAmount = '0';
    instance.rawLog = {
      topics: log.topics as string[],
      data: log.data,
    };
    instance.type = type;
    instance.confirm = confirm;
    instance.category = WebhookCategory.ERC20;
    instance.dateCreated = new Date();
    instance.logIndex = log.index;
    instance.txnIndex = log.transactionIndex;
    if (type === WebhookType.out) {
      instance.associatedAddress = instance.fromAddress;
    }
    if (type === WebhookType.in) {
      instance.associatedAddress = instance.toAddress;
    }
    instance.eventId = instance.generateId();
    return instance;
  }

  public static fromLogToERC721(
    log: Log,
    chain: string,
    monitorId: string,
    type: WebhookType,
    confirm: boolean,
    tokenId: string,
  ): EventHistory {
    const instance = new EventHistory();
    instance.chain = chain;
    instance.monitorId = monitorId;
    instance.hash = log.transactionHash;
    instance.blockNumber = log.blockNumber;
    instance.contract = {
      address: ethers.getAddress(log.address).toLowerCase(),
      name: null,
      symbol: null,
    };
    instance.fromAddress = ethers
      .getAddress(`0x${log.topics[1].substring(26)}`)
      .toLowerCase();
    instance.toAddress = ethers
      .getAddress(`0x${log.topics[2].substring(26)}`)
      .toLowerCase();
    instance.tokenId = tokenId;
    // instance.tokenValue = '0';
    // instance.nativeAmount = '0';
    instance.rawLog = {
      topics: log.topics as string[],
      data: log.data,
    };
    instance.type = type;
    instance.confirm = confirm;
    instance.category = WebhookCategory.ERC721;
    instance.dateCreated = new Date();
    instance.logIndex = log.index;
    instance.txnIndex = log.transactionIndex;
    if (type === WebhookType.out) {
      instance.associatedAddress = instance.fromAddress;
    }
    if (type === WebhookType.in) {
      instance.associatedAddress = instance.toAddress;
    }
    instance.eventId = instance.generateId();
    return instance;
  }

  public static fromTransactionToNative(
    transaction: TransactionResponse,
    chain: string,
    monitorId: string,
    type: WebhookType,
    confirm: boolean,
  ): EventHistory {
    const instance = new EventHistory();
    instance.chain = chain;
    instance.monitorId = monitorId;
    instance.hash = transaction.hash;
    instance.blockNumber = transaction.blockNumber;
    instance.fromAddress = transaction.from.toLowerCase();
    instance.toAddress = transaction.to.toLowerCase();

    // instance.tokenId = '0';
    // instance.tokenValue = '0';
    instance.nativeAmount = transaction.value.toString();
    instance.type = type;
    instance.confirm = confirm;
    instance.category = WebhookCategory.Native;
    instance.dateCreated = new Date();
    instance.txnIndex = transaction.index;
    // @todo assign data from transaction data
    if (type === WebhookType.out) {
      instance.associatedAddress = instance.fromAddress;
    }
    if (type === WebhookType.in) {
      instance.associatedAddress = instance.toAddress;
    }
    instance.eventId = instance.generateId();
    return instance;
  }
}
export type EventHistoryDocument = HydratedDocument<EventHistory>;
export const EventHistorySchema = SchemaFactory.createForClass(EventHistory);
