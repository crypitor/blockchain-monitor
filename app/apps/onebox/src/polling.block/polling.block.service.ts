import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { Cron, CronExpression } from '@nestjs/schedule';
import { EthereumWorker } from 'apps/worker-service/src/worker/evm.worker';
import { ethers } from 'ethers';
import { BlockSyncService } from '../modules/blocksync/blocksync.service';

@Injectable()
export class PollingBlockService {
  private readonly confirmBlock = 12;
  private detectInfo = { flag: false, blockNumber: 0 };

  private readonly logger = new Logger(EthereumWorker.name);
  @Inject('POLLING_BLOCK_SERVICE')
  private readonly workerClient: ClientKafka;

  @Inject(BlockSyncService)
  private readonly blockSyncService: BlockSyncService;

  rpcUrl: string;
  provider: ethers.Provider;

  onModuleInit() {
    console.log(`The module has been initialized.`);
    if (process.env.EVM_DISABLE === 'true') {
      this.detectInfo.flag = true;
      return;
    }
    this.rpcUrl = process.env.ETH_PROVIDER_URL;
    this.provider = new ethers.JsonRpcProvider(process.env.ETH_PROVIDER_URL);
    this.init();
  }

  async init() {
    this.detectInfo.flag = true;
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
    } else if (startBlockConfig === 'config') {
      this.logger.warn(
        'force running start block from config ' + process.env.EVM_START_BLOCK,
      );
      this.updateLastSyncBlock(parseInt(process.env.EVM_START_BLOCK));
      this.detectInfo.blockNumber = parseInt(process.env.EVM_START_BLOCK) - 1;
    } else {
      this.logger.warn('running start block from db ' + blockSync.lastSync);
      this.detectInfo.blockNumber = blockSync.lastSync + this.confirmBlock;
    }
    this.detectInfo.flag = false;
  }

  private async updateLastSyncBlock(blockNumber: number): Promise<void> {
    // Update the last sync block in MongoDB
    await this.blockSyncService.updateLastSync(this.rpcUrl, blockNumber);
  }

  @Cron(CronExpression.EVERY_10_SECONDS, {
    disabled: process.env.EVM_DISABLE === 'true',
  })
  async ethPollingBlock() {
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

        // emit event detect block with blocknumber
        this.workerClient.emit('eth-detect-block', {
          blockNumber: blockNumber,
        });

        // emit event confirm block with block number - confirm block
        this.workerClient.emit('eth-confirm-block', {
          blockNumber: blockNumber - this.confirmBlock,
        });

        //only update last sync for confirm
        await this.updateLastSyncBlock(blockNumber - this.confirmBlock);
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
