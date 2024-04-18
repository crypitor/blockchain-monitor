import { hashMd5 } from '@app/utils/md5';
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
  @Prop({ index: 1, unique: true })
  uniqueId: string; // md5 of message exclude timestamp and confirm

  @Prop()
  chain: string;

  @Prop({ index: 1 })
  monitorId: string;

  @Prop()
  associatedAddress: string;

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

  @Prop({ required: true, index: -1 })
  dateCreated: Date;

  toString(): string {
    return JSON.stringify(this);
  }

  generateUniqueId(): string {
    const data = {
      chain: this.chain,
      monitorId: this.monitorId,
      associatedAddress: this.associatedAddress,
      hash: this.hash,
      blockNum: this.blockNum,
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
}
export type TransactionHistoryDocument = HydratedDocument<TransactionHistory>;
export const TransactionHistorySchema =
  SchemaFactory.createForClass(TransactionHistory);
