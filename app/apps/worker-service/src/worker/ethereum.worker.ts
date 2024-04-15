import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { ethers } from 'ethers';
import { TopicName } from '@app/utils/topicUtils';

@Injectable()
export class EthereumWorker {
  private readonly logger = new Logger(EthereumWorker.name);
  rpcUrl: string;
  provider: ethers.Provider;

  constructor(
    @Inject('MONITOR_CLIENT_SERVICE') private monitorClient: ClientKafka,
  ) {
    if (process.env.ETH_PROVIDER_URL) {
      this.rpcUrl = process.env.ETH_PROVIDER_URL;
      this.provider = new ethers.JsonRpcProvider(process.env.ETH_PROVIDER_URL);
    }
  }

  async ethHandleDetectedBlock(data: { blockNumber: number }) {
    const blockNumber = data.blockNumber;

    try {
      this.logger.log(`DETECT handle block ${blockNumber}`);
      // handle native transfer
      this.handleNativeTransfer(blockNumber, false);
      // handle extracted event for erc20 and nft
      this.handleLog(blockNumber, false);
      //only update last sync for confirm
      // await this.updateLastSyncBlock(blockNumber);
    } catch (error) {
      // @todo re-add error block into kafka, and save in db
      this.logger.error([
        'DETECT',
        `Error scanning block ${blockNumber}:`,
        error,
      ]);
    }

    return;
  }

  async ethHandleConfirmedBlock(data: { blockNumber: number }) {
    const blockNumber = data.blockNumber;
    try {
      this.logger.debug(`CONFIRM Scanning block ${blockNumber}`);
      // handle native transfer
      this.handleNativeTransfer(blockNumber, true);
      // handle extracted event for erc20 and nft
      this.handleLog(blockNumber, true);
    } catch (error) {
      this.logger.error([
        'CONFIRM',
        `Error scanning block ${blockNumber}:`,
        error,
      ]);
    }
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
        this.monitorClient.emit(TopicName.ETH_ERC20_TRANSFER, {
          event: event,
          confirm: confirm,
        });
      } else if (event.topics.length === 4) {
        // this.ethMonitorService.handleErc721Transfer(event, confirm);
        this.monitorClient.emit(TopicName.ETH_ERC721_TRANSFER, {
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
      this.monitorClient.emit(TopicName.ETH_NATIVE_TRANSFER, {
        transaction: transaction,
        confirm: confirm,
      });
    });
  }
}
