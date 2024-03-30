import { Inject, Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ethers } from 'ethers';
import { BlockSyncService } from '../blocksync/blocksync.service';
import { ClientKafka } from '@nestjs/microservices';
import { TopicName } from '@app/utils/topicUtils';

interface ScanInfo {
  flag: boolean;
  blockNumber: number;
}

@Injectable()
export class EthereumWorker {
  private readonly logger = new Logger(EthereumWorker.name);
  private readonly confirmBlock = 12;
  private detectInfo: ScanInfo = { flag: false, blockNumber: 0 };
  private confirmInfo: ScanInfo = { flag: false, blockNumber: 0 };
  rpcUrl: string;
  provider: ethers.Provider;

  @Inject(BlockSyncService)
  private readonly blockSyncService: BlockSyncService;

  @Inject('MONITOR_SERVICE')
  private readonly monitorConsumer: ClientKafka;

  enable: boolean;

  constructor() {
    // ethMonitorService: EthMonitorService, // blockSyncService: BlockSyncService, // @Inject('MONITOR_SERVICE') monitorConsumer: ClientKafka,
    // if (process.env.EVM_DISABLE === 'true') {
    //   this.detectInfo.flag = true;
    //   this.confirmInfo.flag = true;
    //   return;
    // }
    // this.rpcUrl = process.env.ETH_PROVIDER_URL;
    // this.provider = new ethers.JsonRpcProvider(process.env.ETH_PROVIDER_URL);
    // this.blockSyncService = blockSyncService;
    // this.ethMonitorService = ethMonitorService;
    // this.monitorConsumer = monitorConsumer;
    // this.initWorker();
  }

  onModuleInit() {
    console.log(`The module has been initialized.`);
    if (process.env.EVM_DISABLE === 'true') {
      this.detectInfo.flag = true;
      this.confirmInfo.flag = true;
      return;
    }
    this.rpcUrl = process.env.ETH_PROVIDER_URL;
    this.provider = new ethers.JsonRpcProvider(process.env.ETH_PROVIDER_URL);
    this.initWorker();
  }

  onApplicationShutdown(signal: string) {
    console.log(signal); // e.g. "SIGINT"
  }

  async initWorker() {
    this.detectInfo.flag = true;
    this.confirmInfo.flag = true;
    let blockSync = await this.blockSyncService.findOne(this.rpcUrl);
    if (!blockSync) {
      blockSync = await this.blockSyncService.create({
        rpcUrl: this.rpcUrl,
        lastSync: parseInt(process.env.EVM_START_BLOCK),
      });
    }
    // checking force latest block config
    const startBlockConfig = process.env.EVM_START_BLOCK_CONFIG;
    if (startBlockConfig === 'latest') {
      const latestBlockNumber = await this.provider.getBlockNumber();
      this.logger.warn(
        'force running latest block from network ' + latestBlockNumber,
      );
      this.updateLastSyncBlock(latestBlockNumber);
      this.detectInfo.blockNumber = latestBlockNumber - 1;
      this.confirmInfo.blockNumber = latestBlockNumber - 1;
    } else if (startBlockConfig === 'config') {
      this.logger.warn(
        'force running start block from config ' + process.env.EVM_START_BLOCK,
      );
      this.updateLastSyncBlock(parseInt(process.env.EVM_START_BLOCK));
      this.detectInfo.blockNumber = parseInt(process.env.EVM_START_BLOCK) - 1;
      this.confirmInfo.blockNumber = parseInt(process.env.EVM_START_BLOCK) - 1;
    } else {
      this.logger.warn('running start block from db ' + blockSync.lastSync);
      this.detectInfo.blockNumber = blockSync.lastSync + this.confirmBlock;
      this.confirmInfo.blockNumber = blockSync.lastSync;
    }
    this.detectInfo.flag = false;
    this.confirmInfo.flag = false;
  }

  @Cron(CronExpression.EVERY_10_SECONDS, {
    name: 'detect',
    disabled: process.env.EVM_DISABLE === 'true',
  })
  async detect() {
    console.log('Start detect block');
    if (this.detectInfo.flag) {
      return;
    }
    this.detectInfo.flag = true;
    const lastDetectedBlock = this.detectInfo.blockNumber + 1;

    // Get the latest block number
    const latestDetectedBlockNumber = await this.getBlockNumber();

    // Scan each block
    for (
      let blockNumber = lastDetectedBlock;
      blockNumber <= latestDetectedBlockNumber;
      blockNumber++
    ) {
      try {
        this.logger.debug(['DETECT', `Scanning block ${blockNumber}`]);
        // handle native transfer
        this.handleNativeTransfer(blockNumber, false);
        // handle extracted event for erc20 and nft
        this.handleLog(blockNumber, false);
        this.detectInfo.blockNumber = blockNumber;
        //only update last sync for confirm
        // await this.updateLastSyncBlock(blockNumber);
      } catch (error) {
        this.logger.error([
          'DETECT',
          `Error scanning block ${blockNumber}:`,
          error,
        ]);
        break;
      }
    }

    this.detectInfo.flag = false;
    return;
  }

  @Cron(CronExpression.EVERY_10_SECONDS, {
    disabled: process.env.EVM_DISABLE === 'true',
  })
  async confirm() {
    if (this.confirmInfo.flag) {
      return;
    }
    this.confirmInfo.flag = true;

    const lastConfirmedBlock = this.confirmInfo.blockNumber + 1;

    // Get the latest block number
    const latestConfirmedBlockNumber =
      (await this.getBlockNumber()) - this.confirmBlock;

    // Scan each block
    for (
      let blockNumber = lastConfirmedBlock;
      blockNumber <= latestConfirmedBlockNumber;
      blockNumber++
    ) {
      try {
        this.logger.debug(['CONFIRM', `Scanning block ${blockNumber}`]);
        // handle native transfer
        this.handleNativeTransfer(blockNumber, true);
        // handle extracted event for erc20 and nft
        this.handleLog(blockNumber, true);
        this.confirmInfo.blockNumber = blockNumber;
        await this.updateLastSyncBlock(blockNumber);
      } catch (error) {
        this.logger.error([
          'CONFIRM',
          `Error scanning block ${blockNumber}:`,
          error,
        ]);
        break;
      }
    }

    this.confirmInfo.flag = false;
    return;
  }

  private async handleLog(
    blockNumber: number,
    confirm: boolean,
  ): Promise<void> {
    // Retrieve transfer event the block's logs
    const logs = await this.provider.getLogs({
      fromBlock: blockNumber,
      toBlock: blockNumber,
      topics: [
        '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
      ],
    });

    // handle extracted event for erc20 and nft
    logs.forEach((event) => {
      if (event.topics.length === 3) {
        // this.ethMonitorService.handleErc20Transfer(event, confirm);
        this.monitorConsumer.emit(TopicName.ETH_ERC20_TRANSFER, {
          event: event,
          confirm: confirm,
        });
      } else if (event.topics.length === 4) {
        // this.ethMonitorService.handleErc721Transfer(event, confirm);
        this.monitorConsumer.emit(TopicName.ETH_ERC721_TRANSFER, {
          event: event,
          confirm: confirm,
        });
      }
    });
  }

  private async handleNativeTransfer(
    blockNumber: number,
    confirm: boolean,
  ): Promise<void> {
    // Retrieve all transaction in block
    const block = await this.provider.getBlock(blockNumber, true);

    // handle extracted event for native
    block.prefetchedTransactions.forEach((transaction) => {
      // this.ethMonitorService.handleNativeTransfer(transaction, confirm);
      this.monitorConsumer.emit(TopicName.ETH_NATIVE_TRANSFER, {
        transaction: transaction,
        confirm: confirm,
      });
    });
  }

  private async updateLastSyncBlock(blockNumber: number): Promise<void> {
    // Update the last sync block in MongoDB
    await this.blockSyncService.updateLastSync(this.rpcUrl, blockNumber);
  }

  private async getLastSyncBlock(): Promise<number> {
    // Get the last sync block from MongoDB
    const lastSyncBlock = await this.blockSyncService.findOne(this.rpcUrl);
    return lastSyncBlock?.lastSync;
  }

  private async getBlockNumber(): Promise<number> {
    try {
      const blockNumber = await this.provider.getBlockNumber();
      return blockNumber;
    } catch (error) {
      this.logger.error('error while getting block number', error);
    }
    return 0;
  }
}
