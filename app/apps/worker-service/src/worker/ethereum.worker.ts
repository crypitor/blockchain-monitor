import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { Block, ethers, Log } from 'ethers';
import { TopicName } from '@app/utils/topicUtils';
import { BlockHistory } from '@app/shared_modules/block_history/schemas/block_history.schema';
import { EthBlockHistoryRepository } from '@app/shared_modules/block_history/repositories/block_history.repository';
import { MonitorNetwork } from '@app/shared_modules/monitor/schemas/monitor.schema';
import { now } from 'mongoose';

@Injectable()
export class EthereumWorker {
  private readonly logger = new Logger(EthereumWorker.name);
  rpcUrl: string;
  provider: ethers.Provider;

  constructor(
    @Inject('MONITOR_CLIENT_SERVICE') private monitorClient: ClientKafka,
    @Inject()
    private readonly blockHistoryRepository: EthBlockHistoryRepository,
  ) {
    if (process.env.ETH_PROVIDER_URL) {
      this.rpcUrl = process.env.ETH_PROVIDER_URL;
      this.provider = new ethers.JsonRpcProvider(
        process.env.ETH_PROVIDER_URL,
        null,
        { staticNetwork: true },
      );
    }
  }

  async ethHandleDetectedBlock(data: { blockNumber: number }) {
    const blockNumber = data.blockNumber;

    try {
      this.logger.log(`DETECT handle block ${blockNumber}`);
      // Retrieve all transaction in block
      const block = await this.provider.getBlock(blockNumber, true);

      // Retrieve transfer event the block's logs
      const logs = await this.provider.getLogs({
        fromBlock: blockNumber,
        toBlock: blockNumber,
        topics: [
          '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
        ],
      });

      // handle native transfer
      await this.emitNativeTransaction(block, false);
      // handle extracted event for erc20 and nft
      await this.emitLog(logs, false);
      //only update last sync for confirm
      await this.saveBlockHistory(blockNumber, false);
    } catch (error) {
      // @todo re-add error block into kafka, and save in db
      this.logger.error([
        'DETECT',
        `Error scanning block ${blockNumber}:`,
        error,
      ]);
      await this.saveBlockHistory(blockNumber, false, true, error);
    }

    return;
  }

  async ethHandleConfirmedBlock(data: { blockNumber: number }) {
    const blockNumber = data.blockNumber;
    try {
      this.logger.log(`CONFIRM Scanning block ${blockNumber}`);
      // Retrieve all transaction in block
      const block = await this.provider.getBlock(blockNumber, true);
      // Retrieve transfer event the block's logs
      const logs = await this.provider.getLogs({
        fromBlock: blockNumber,
        toBlock: blockNumber,
        topics: [
          '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
        ],
      });
      // handle native transfer
      this.emitNativeTransaction(block, true);
      // handle extracted event for erc20 and nft
      this.emitLog(logs, true);

      await this.saveBlockHistory(blockNumber, true);
    } catch (error) {
      this.logger.error([
        'CONFIRM',
        `Error scanning block ${blockNumber}:`,
        error,
      ]);
      await this.saveBlockHistory(blockNumber, true, true, error);
    }
    return;
  }

  private async emitLog(logs: Log[], confirm: boolean): Promise<void> {
    // handle extracted event for erc20 and nft
    logs.forEach((event) => {
      if (event.topics.length === 3) {
        this.logger.debug(`emit event on ERC20 ${JSON.stringify(event)}`);
        this.monitorClient.emit(TopicName.ETH_ERC20_TRANSFER, {
          event: event,
          confirm: confirm,
        });
      } else if (event.topics.length === 4) {
        this.logger.debug(`emit event on ERC721 ${JSON.stringify(event)}`);
        this.monitorClient.emit(TopicName.ETH_ERC721_TRANSFER, {
          event: event,
          confirm: confirm,
        });
      }
    });
  }

  private async emitNativeTransaction(
    block: Block,
    confirm: boolean,
  ): Promise<void> {
    // handle extracted event for native
    block.prefetchedTransactions.forEach((transaction) => {
      this.logger.debug(`emit event on NATIVE ${JSON.stringify(transaction)}`);
      this.monitorClient.emit(TopicName.ETH_NATIVE_TRANSFER, {
        transaction: transaction,
        confirm: confirm,
      });
    });
  }

  private async saveBlockHistory(
    blockNum: number,
    confirm: boolean,
    isError?: boolean,
    error?: any,
  ): Promise<void> {
    if (isError) {
      this.logger.error(`error handle block ${JSON.stringify(error)}`);
    }
    this.logger.debug(`save block history $(blockNum)}`);
    await this.blockHistoryRepository.saveBlockHistory({
      blockNum: blockNum,
      chain: MonitorNetwork.Ethereum,
      confirmed: confirm,
      isError: isError || false,
      errorDetail: error !== undefined ? JSON.stringify(error) : '',
      dateCreated: new Date(),
    });
  }
}
