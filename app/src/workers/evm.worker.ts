
import { Inject, Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Log, ethers } from 'ethers';
import { Model } from 'mongoose';
import { BlockSyncService } from 'src/modules/blocksync/blocksync.service';
import { BlockSyncDocument } from 'src/modules/blocksync/schemas/blocksync.schema';
import { ERC721Service } from 'src/modules/erc721/erc721.service';
import { WalletService } from 'src/modules/wallet/wallet.service';

interface WebhookDto {
    contractAddress: string;
    transactionHash: string;
    fromAddress: string;
    toAddress: string;
    tokenId: string;
    type: 'in' | 'out';
}

@Injectable()
export class EvmWorker {
    private readonly logger = new Logger(EvmWorker.name);
    flag = false;
    rpcUrl: string;
    provider: ethers.Provider;
    blockSyncService: BlockSyncService;
    walletService: WalletService;
    erc721Service: ERC721Service;


    constructor(blockSyncService: BlockSyncService, walletService: WalletService, erc721Service: ERC721Service) {
        this.rpcUrl = process.env.WEB3_PROVIDER_URL;
        // Initialize the Ethereum provider
        this.provider = new ethers.JsonRpcProvider(process.env.WEB3_PROVIDER_URL);
        this.blockSyncService = blockSyncService;
        this.walletService = walletService;
        this.erc721Service = erc721Service;
    }

    @Cron(CronExpression.EVERY_5_SECONDS)
    async detect() {
        if (this.flag) {
            return;
        }
        this.flag = true;

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
                this.logger.debug(`Scanning block ${blockNumber}`);
                // Retrieve the block
                // const block = await this.provider.getBlock(blockNumber);

                // Retrieve transfer event the block's logs
                const logs = await this.provider.getLogs({ fromBlock: blockNumber, toBlock: blockNumber, topics: ['0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef', null, null, null, null, null] });

                // Handle the extracted NFT transfer events
                logs.forEach(event => {
                    // Check if the event is an NFT transfer
                    if (event.topics.length === 4) {
                        this.handleNftTransfer(event);
                    }
                });
            } catch (error) {
                console.error(`Error scanning block ${blockNumber}:`, error);
            }
        }
        this.updateLastSyncBlock(latestBlockNumber);
        this.flag = false;
    }

    async handleNftTransfer(event: Log) {
        // Extract relevant information from the event
        const contractAddress = ethers.getAddress(event.address).toLowerCase();
        const fromAddress = ethers.getAddress(event.topics[1].substring(26)).toLowerCase();
        const toAddress = ethers.getAddress(event.topics[2].substring(26)).toLowerCase();
        const tokenId = ethers.toBigInt(event.topics[3]).toString();
        // check contract address is supported in erc721
        const erc721 = await this.erc721Service.findOne(contractAddress);
        if (!erc721) {
            console.log("unsupported contract address");
            return;
        }

        // handle from wallet
        const fromWallet = await this.walletService.findOne(fromAddress);
        if (fromWallet) {
            // send tranction detail to fromWallet.webhookUrl with WebhookDto
            fetch(fromWallet.webhookUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    contractAddress: contractAddress,
                    transactionHash: event.transactionHash,
                    fromAddress: fromAddress,
                    toAddress: toAddress,
                    tokenId: tokenId,
                    type: 'out'
                })
            })
        }

        // handle to wallet
        const toWallet = await this.walletService.findOne(toAddress);
        if (toWallet) {
            // send transaction detail to toWallet.webhookUrl with WebhookDto
            fetch(toWallet.webhookUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    contractAddress: contractAddress,
                    transactionHash: event.transactionHash,
                    fromAddress: fromAddress,
                    toAddress: toAddress,
                    tokenId: tokenId,
                    type: 'in'
                })
            })
        }


        // Do something with the extracted information 
        // this.logger.debug(`NFT transfer event: Token ID ${tokenId}, From ${fromAddress}, To ${toAddress} transaction hash: ${event.transactionHash}`);
    }

    async updateLastSyncBlock(blockNumber: number): Promise<void> {
        // Update the last sync block in MongoDB
        await this.blockSyncService.updateLastSync(this.rpcUrl, blockNumber);
    }

    async getLastSyncBlock(): Promise<number> {
        // Get the last sync block from MongoDB
        const lastSyncBlock = await this.blockSyncService.findOne(this.rpcUrl);
        // Check if the last sync block exists
        if (!lastSyncBlock) {
            await this.blockSyncService.create({ rpcUrl: this.rpcUrl, lastSync: parseInt(process.env.EVM_START_BLOCK) });
        }

        if (process.env.EVM_START_FROM_CONFIG === 'true') {
            // force running with start block from config
            this.updateLastSyncBlock(parseInt(process.env.EVM_START_BLOCK));
            return parseInt(process.env.EVM_START_BLOCK);
        }

        return lastSyncBlock?.lastSync;
    }
}
