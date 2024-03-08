interface WebhookDto extends ReadableStream {
  id: string;
  chainId: string;
  webhookId: string;
  hash: string;
  blockNum: string; // hex string
  contract: {
    address: string;
    name: string;
    symbol: string;
  };
  fromAddress: string;
  toAddress: string;
  tokenId: string;
  tokenValue: string; // decimal string
  nativeAmount: string; // decimal string
  type: 'in' | 'out';
  confirm: boolean;
  category: 'NFT' | 'Native' | 'ERC20';
  rawLog: [];
  logIndex: number;
  txnIndex: number;
}
