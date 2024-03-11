import { Log, ethers } from 'ethers';
import { generateUUID } from 'src/utils/uuidUtils';

export enum WebhookCategory {
  NFT = 'NFT',
  Native = 'Native',
  ERC20 = 'ERC20',
}

export enum WebhookType {
  in = 'in',
  out = 'out',
}
export class WebhookDeliveryDto {
  id: string;
  chain: string;
  webhookId: string;
  hash: string;
  blockNum: number; // decimal string
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

  public static fromLogToERC20(
    log: Log,
    chain: string,
    webhookId: string,
    type: WebhookType,
    confirm: boolean,
    tokenValue: string,
  ): WebhookDeliveryDto {
    const instance = new WebhookDeliveryDto();
    instance.id = generateUUID();
    instance.chain = chain;
    instance.webhookId = webhookId;
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
    instance.rawLog.topics = log.topics as string[];
    instance.rawLog.data = log.data;
    instance.type = type;
    instance.confirm = confirm;
    instance.category = WebhookCategory.ERC20;

    return instance;
  }

  public static fromLogToERC721(
    log: Log,
    chain: string,
    webhookId: string,
    type: WebhookType,
    confirm: boolean,
    tokenId: string,
  ): WebhookDeliveryDto {
    const instance = new WebhookDeliveryDto();
    instance.id = generateUUID();
    instance.chain = chain;
    instance.webhookId = webhookId;
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
    instance.rawLog.topics = log.topics as string[];
    instance.rawLog.data = log.data;
    instance.type = type;
    instance.confirm = confirm;
    instance.category = WebhookCategory.NFT;

    return instance;
  }
}
