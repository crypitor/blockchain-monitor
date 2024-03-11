import { Log } from 'ethers';
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

  // generate constructor from Log
  constructor(
    log: Log,
    chainId: number,
    webhookId: string,
    type: 'in' | 'out',
    confirm: boolean,
    tokenValue: string,
  ) {
    this.id = generateUUID();
    this.chainId = chainId;
    this.webhookId = webhookId;
    this.hash = log.transactionHash;
    this.blockNum = log.blockNumber;
    this.contract = {
      address: log.address,
      name: null,
      symbol: null,
    };
    this.fromAddress = log.topics[1].substring(26);
    this.toAddress = log.topics[2].substring(26);
    this.tokenId = '0';
    this.tokenValue = tokenValue;
    this.nativeAmount = '0';
    this.rawLog.topics = log.topics as string[];
    this.rawLog.data = log.data;
    this.type = type;
    this.confirm = confirm;
  }
}
