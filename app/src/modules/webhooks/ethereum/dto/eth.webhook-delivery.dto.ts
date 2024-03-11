import { Log, ethers } from 'ethers';
import { generateUUID } from 'src/utils/uuidUtils';

export class WebhookDeliveryDto {
  id: string;
  chainId: number;
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
  type: 'in' | 'out';
  confirm: boolean;
  category: 'NFT' | 'Native' | 'ERC20';
  rawLog: {
    topics: string[];
    data: string;
  };
  logIndex: number;
  txnIndex: number;

  public static fromLogToERC20(
    log: Log,
    chainId: number,
    webhookId: string,
    type: 'in' | 'out',
    confirm: boolean,
    tokenValue: string,
  ): WebhookDeliveryDto {
    const instance = new WebhookDeliveryDto();
    instance.id = generateUUID();
    instance.chainId = chainId;
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

    return instance;
  }

  public static fromLogToNFT(
    log: Log,
    chainId: number,
    webhookId: string,
    type: 'in' | 'out',
    confirm: boolean,
    tokenId: string,
  ): WebhookDeliveryDto {
    const instance = new WebhookDeliveryDto();
    instance.id = generateUUID();
    instance.chainId = chainId;
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

    return instance;
  }
}
