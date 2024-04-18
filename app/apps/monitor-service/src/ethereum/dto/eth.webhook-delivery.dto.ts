import { generateWebhookEventId } from '@app/utils/uuidUtils';
import { Log, TransactionResponse, ethers } from 'ethers';

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
export class WebhookDeliveryDto {
  id: string;
  chain: string;
  monitorId: string;
  hash: string;
  blockNum: number; // decimal string
  associatedAddress: string;
  contract: {
    address: string;
    name: string;
    symbol: string;
  };
  fromAddress: string;
  toAddress: string;
  tokenId: string; // decimal string
  tokenValue: string; // decimal string
  nativeAmount: string; // decimal string
  type: WebhookType;
  confirm: boolean;
  category: WebhookCategory;
  rawLog: {
    topics: string[];
    data: string;
  };
  logIndex: number;
  txnIndex: number;
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
  ): WebhookDeliveryDto {
    const instance = new WebhookDeliveryDto();
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
  ): WebhookDeliveryDto {
    const instance = new WebhookDeliveryDto();
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
  ): WebhookDeliveryDto {
    const instance = new WebhookDeliveryDto();
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
    // @todo assign data from transaction data

    return instance;
  }
}
