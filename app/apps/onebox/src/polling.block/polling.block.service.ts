import { TopicName } from '@app/utils/topicUtils';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { CronExpression, SchedulerRegistry } from '@nestjs/schedule';
import { EthereumWorker } from 'apps/worker-service/src/worker/evm.worker';
import { CronJob } from 'cron';
import { ethers } from 'ethers';
import { BlockSyncService } from '../modules/blocksync/blocksync.service';

@Injectable()
export class PollingBlockService {
  private readonly confirmBlock = 12;
  private detectInfo = { flag: false, blockNumber: 0 };

  private readonly logger = new Logger(EthereumWorker.name);

  constructor(
    private schedulerRegistry: SchedulerRegistry,
    private readonly blockSyncService: BlockSyncService,
    @Inject('WORKER_CLIENT_SERVICE')
    private readonly workerClient: ClientKafka,
  ) {}

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
      // if start at latest block, we need to minus 1
      // we suppose that we already scan at (latest block - 1)
      this.detectInfo.blockNumber = latestBlockNumber - 1;
    } else if (startBlockConfig === 'config') {
      this.logger.warn(
        'force running start block from config ' + process.env.EVM_START_BLOCK,
      );
      this.updateLastSyncBlock(parseInt(process.env.EVM_START_BLOCK));
      // if we start at config block, we suppose that we already scan at (config block - 1)
      this.detectInfo.blockNumber = parseInt(process.env.EVM_START_BLOCK) - 1;
    } else {
      this.logger.warn('running start block from db ' + blockSync.lastSync);
      // if we start at db block, we suppose that we already scan at db block
      this.detectInfo.blockNumber = blockSync.lastSync + this.confirmBlock;
    }
    this.detectInfo.flag = false;
    this.addCronJob('ethPollingBlock', '10');
  }

  addCronJob(name: string, seconds: string) {
    const job = new CronJob(CronExpression.EVERY_10_SECONDS, () =>
      this.ethPollingBlock(),
    );

    this.schedulerRegistry.addCronJob(name, job);
    job.start();

    this.logger.warn(`job ${name} added for each ${seconds} seconds!`);
  }

  private async updateLastSyncBlock(blockNumber: number): Promise<void> {
    // Update the last sync block in MongoDB
    await this.blockSyncService.updateLastSync(this.rpcUrl, blockNumber);
  }

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
        this.logger.log(`start polling block ${blockNumber}`);

        // emit event detect block with blocknumber
        this.logger.debug(['DETECT', `send block ${blockNumber}`]);
        this.workerClient.emit(TopicName.ETH_DETECTED_BLOCK, {
          blockNumber: blockNumber,
        });

        this.logger.debug(['CONFIRM', `send block ${blockNumber}`]);
        // emit event confirm block with block number - confirm block
        this.workerClient.emit(TopicName.ETH_CONFIRMED_BLOCK, {
          blockNumber: blockNumber - this.confirmBlock,
        });

        this.detectInfo.blockNumber = blockNumber;

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
