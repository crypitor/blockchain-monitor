
import { Inject, Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Log, ethers } from 'ethers';
import { BlockSyncService } from 'src/modules/blocksync/blocksync.service';
import { ERC721Service } from 'src/modules/erc721/erc721.service';
import { ERC721 } from 'src/modules/erc721/schemas/erc721.schema';
import { WalletService } from 'src/modules/wallet/wallet.service';

interface WebhookDto extends ReadableStream {
    contract: {
        address: string;
        name: string;
        symbol: string;
    };
    transactionHash: string;
    fromAddress: string;
    toAddress: string;
    tokenId: string;
    type: 'in' | 'out';
    action: 'detected' | 'confirmed';
}

@Injectable()
export class EvmWorker {
    private readonly logger = new Logger(EvmWorker.name);
    private flag = false;
    rpcUrl: string;
    provider: ethers.Provider;
    blockSyncService: BlockSyncService;
    walletService: WalletService;
    erc721Service: ERC721Service;


    constructor(blockSyncService: BlockSyncService, walletService: WalletService, erc721Service: ERC721Service) {
        this.rpcUrl = process.env.WEB3_PROVIDER_URL;
        this.provider = new ethers.JsonRpcProvider(process.env.WEB3_PROVIDER_URL);
        this.blockSyncService = blockSyncService;
        this.walletService = walletService;
        this.erc721Service = erc721Service;
        this.initWorker();
    }

    async initWorker() {
        this.flag = true;
        let blockSync = await this.blockSyncService.findOne(this.rpcUrl);
        if (!blockSync) {
            blockSync = await this.blockSyncService.create({ rpcUrl: this.rpcUrl, lastSync: parseInt(process.env.EVM_START_BLOCK) });
        }
        // checking force latest block config
        const startBlockConfig = process.env.EVM_START_BLOCK_CONFIG;
        if (startBlockConfig === 'latest') {
            const latestBlockNumber = await this.provider.getBlockNumber();
            this.logger.debug("force running latest block " + latestBlockNumber);
            this.blockSyncService.updateLastSync(this.rpcUrl, latestBlockNumber);
        } else if (startBlockConfig === 'config') {
            this.logger.debug("force running from config " + process.env.EVM_START_BLOCK);
            this.updateLastSyncBlock(parseInt(process.env.EVM_START_BLOCK));
        } else {
            this.logger.debug('running from db ' + blockSync.lastSync);
        }
        this.flag = false;
    }

    @Cron(CronExpression.EVERY_5_SECONDS)
    async detect() {
        if (this.flag) {
            console.log('worker is running');
            return;
        }
        this.flag = true;

        const lastSyncBlock = await this.getLastSyncBlock();
        // this.logger.debug("last sync block from db: " + lastSyncBlock);

        // Get the latest block number
        const latestBlockNumber = await this.provider.getBlockNumber();
        // this.logger.debug("latest block number: " + latestBlockNumber);

        // Scan each block
        for (let blockNumber = lastSyncBlock + 1; blockNumber <= latestBlockNumber; blockNumber++) {
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
                        this.handleNftTransfer(event, 'detected');
                    }
                });
                await this.updateLastSyncBlock(blockNumber);
            } catch (error) {
                console.error(`Error scanning block ${blockNumber}:`, error);
            }
        }
        this.flag = false;
        return;
    }

    async handleNftTransfer(event: Log, action: string) {
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
            const body = {
                contract: {
                    address: erc721.token_address,
                    name: erc721.name,
                    symbol: erc721.symbol
                },
                transactionHash: event.transactionHash,
                fromAddress: fromAddress,
                toAddress: toAddress,
                tokenId: tokenId,
                type: 'out',
                action: action
            } as WebhookDto;
            // send tranction detail to fromWallet.webhookUrl with WebhookDto
            await this.sendMessage(fromWallet.webhookUrl, body);

            this.logger.debug(action + ' nft transfer OUT with database: ' + JSON.stringify(body));
        }

        // handle to wallet
        const toWallet = await this.walletService.findOne(toAddress);
        if (toWallet) {
            const body = {
                contract: {
                    address: erc721.token_address,
                    name: erc721.name,
                    symbol: erc721.symbol
                },
                transactionHash: event.transactionHash,
                fromAddress: fromAddress,
                toAddress: toAddress,
                tokenId: tokenId,
                type: 'in',
                action: action
            } as WebhookDto;
            // send transaction detail to toWallet.webhookUrl with WebhookDto
            await this.sendMessage(toWallet.webhookUrl, body);

            this.logger.debug(action + ' nft transfer OUT with database: ' + JSON.stringify(body));
        }
    }

    async updateLastSyncBlock(blockNumber: number): Promise<void> {
        // Update the last sync block in MongoDB
        await this.blockSyncService.updateLastSync(this.rpcUrl, blockNumber);
    }

    async getLastSyncBlock(): Promise<number> {
        // Get the last sync block from MongoDB
        const lastSyncBlock = await this.blockSyncService.findOne(this.rpcUrl);
        return lastSyncBlock?.lastSync;
    }

    async sendMessage(url: string, message: WebhookDto): Promise<void> {
        await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(message)
        });
    }
}
