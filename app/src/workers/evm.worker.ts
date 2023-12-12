
import { Inject, Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ethers } from 'ethers';
import { Model } from 'mongoose';
import { BlockSyncService } from 'src/modules/blocksync/blocksync.service';
import { BlockSyncDocument } from 'src/modules/blocksync/schemas/blocksync.schema';

@Injectable()
export class EvmWorker {
    private readonly logger = new Logger(EvmWorker.name);
    rpcUrl: string;
    provider: ethers.Provider;
    blockSyncService: BlockSyncService;


    constructor(blockSyncService: BlockSyncService) {
        this.rpcUrl = process.env.WEB3_PROVIDER_URL;
        // Initialize the Ethereum provider
        this.provider = new ethers.JsonRpcProvider(process.env.WEB3_PROVIDER_URL);
        this.blockSyncService = blockSyncService;
    }

    @Cron(CronExpression.EVERY_5_SECONDS)
    async detect() {
        this.logger.debug('Start getting transaction events');
        this.logger.debug("connected to rpc url: ", this.rpcUrl);
        const lastSyncBlock = await this.getLastSyncBlock();
        this.logger.debug("last sync block from db: " + lastSyncBlock);

        // Get the latest block number
        const latestBlockNumber = await this.provider.getBlockNumber();
        this.logger.debug("latest block number: " + latestBlockNumber);

        // Scan each block
        for (let blockNumber = lastSyncBlock; blockNumber <= latestBlockNumber; blockNumber++) {
            try {
                // Retrieve the block
                const block = await this.provider.getBlock(blockNumber);

                // Retrieve transfer event the block's logs
                const logs = await this.provider.getLogs({ fromBlock: blockNumber, toBlock: blockNumber, topics: ['0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef', null, null] });

                // Handle the extracted NFT transfer events
                logs.forEach(event => {
                    // Extract relevant information from the event
                    const fromAddress = ethers.getAddress(event.topics[1]);
                    const toAddress = ethers.getAddress(event.topics[2]);
                    const tokenId = event.topics[3];

                    // Do something with the extracted information
                    this.logger.debug(`NFT transfer event: Token ID ${tokenId}, From ${fromAddress}, To ${toAddress}`);
                });
            } catch (error) {
                console.error(`Error scanning block ${blockNumber}:`, error);
            }
        }
        this.updateLastSyncBlock(latestBlockNumber);
    }

    async updateLastSyncBlock(blockNumber: number): Promise<void> {
        // Update the last sync block in MongoDB
        await this.blockSyncService.updateLastSync(this.rpcUrl, blockNumber);
    }

    async getLastSyncBlock(): Promise<number> {
        // Use Mongoose to retrieve the last sync block from MongoDB
        const lastSyncBlock = await this.blockSyncService.findOne(this.rpcUrl);
        if (!lastSyncBlock) {
            await this.blockSyncService.create({ rpcUrl: this.rpcUrl, lastSync: parseInt(process.env.EVM_START_BLOCK) });
        }

        return lastSyncBlock?.lastSync || parseInt(process.env.EVM_START_SYNCED_BLOCK);
    }
}
