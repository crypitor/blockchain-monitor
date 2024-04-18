import { generateWebhookEventId } from '@app/utils/uuidUtils';
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
export class TransactionHistory {
  @Prop({ index: 1 })
  id: string;

  @Prop({ index: 1, unique: true })
  uniqueId: string; // md5 of message exclude timestamp and confirm

  @Prop()
  chain: string;

  @Prop({ index: 1 })
  monitorId: string;

  @Prop()
  hash: string;

  @Prop()
  blockNum: number; // decimal string

  @Prop()
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

  @Prop()
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

  toString(): string {
    return JSON.stringify(this);
  }

  public static fromLogToERC20(
    log: Log,
    chain: string,
    monitorId: string,
    type: WebhookType,
    confirm: boolean,
    tokenValue: string,
  ): TransactionHistory {
    const instance = new TransactionHistory();
    instance.id = generateWebhookEventId();
    instance.chain = chain;
    instance.monitorId = monitorId;
    instance.hash = log.transactionHash;
    instance.blockNum = log.blockNumber;
    instance.contract = {
      address: ethers.getAddress(log.address).toLowerCase(),
      name: null,
      symbol: null,
    };
    instance.fromAddress = log.topics[1].substring(26);
    instance.toAddress = log.topics[2].substring(26);
    instance.tokenId = '0';
    instance.tokenValue = tokenValue;
    instance.nativeAmount = '0';
    instance.rawLog = {
      topics: log.topics as string[],
      data: log.data,
    };
    instance.type = type;
    instance.confirm = confirm;
    instance.category = WebhookCategory.ERC20;

    return instance;
  }

  public static fromLogToERC721(
    log: Log,
    chain: string,
    monitorId: string,
    type: WebhookType,
    confirm: boolean,
    tokenId: string,
  ): TransactionHistory {
    const instance = new TransactionHistory();
    instance.id = generateWebhookEventId();
    instance.chain = chain;
    instance.monitorId = monitorId;
    instance.hash = log.transactionHash;
    instance.blockNum = log.blockNumber;
    instance.contract = {
      address: ethers.getAddress(log.address).toLowerCase(),
      name: null,
      symbol: null,
    };
    instance.fromAddress = log.topics[1].substring(26);
    instance.toAddress = log.topics[2].substring(26);
    instance.tokenId = tokenId;
    instance.tokenValue = '0';
    instance.nativeAmount = '0';
    instance.rawLog = {
      topics: log.topics as string[],
      data: log.data,
    };
    instance.type = type;
    instance.confirm = confirm;
    instance.category = WebhookCategory.ERC721;

    return instance;
  }

  public static fromTransactionToNative(
    transaction: TransactionResponse,
    chain: string,
    monitorId: string,
    type: WebhookType,
    confirm: boolean,
  ): TransactionHistory {
    const instance = new TransactionHistory();
    instance.id = generateWebhookEventId();
    instance.chain = chain;
    instance.monitorId = monitorId;
    instance.hash = transaction.hash;
    instance.blockNum = transaction.blockNumber;
    instance.fromAddress = transaction.from.toLowerCase();
    instance.toAddress = transaction.to.toLowerCase();

    instance.tokenId = '0';
    instance.tokenValue = '0';
    instance.nativeAmount = transaction.value.toString();
    instance.type = type;
    instance.confirm = confirm;
    instance.category = WebhookCategory.Native;
    return instance;
  }
}
export type TransactionHistoryDocument = HydratedDocument<TransactionHistory>;
export const WebhookDeliverySchema =
  SchemaFactory.createForClass(TransactionHistory);
