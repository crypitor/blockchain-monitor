
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

interface ScanInfo {
    flag: boolean;
    blockNumber: number;
}

@Injectable()
export class EvmWorker {
    private readonly logger = new Logger(EvmWorker.name);
    private readonly confirmBlock = 15;
    private detectInfo: ScanInfo = { flag: false, blockNumber: 0 };
    private confirmInfo: ScanInfo = { flag: false, blockNumber: 0 };
    private disabled = false;
    rpcUrl: string;
    provider: ethers.Provider;
    blockSyncService: BlockSyncService;
    walletService: WalletService;
    erc721Service: ERC721Service;


    constructor(blockSyncService: BlockSyncService, walletService: WalletService, erc721Service: ERC721Service) {
        if (process.env.EVM_DISABLE === 'true') {
            this.disabled = true;
            return;
        }
        this.rpcUrl = process.env.WEB3_PROVIDER_URL;
        this.provider = new ethers.JsonRpcProvider(process.env.WEB3_PROVIDER_URL);
        this.blockSyncService = blockSyncService;
        this.walletService = walletService;
        this.erc721Service = erc721Service;
        this.initWorker();
    }

    async initWorker() {
        this.detectInfo.flag = true; this.confirmInfo.flag = true;
        let blockSync = await this.blockSyncService.findOne(this.rpcUrl);
        if (!blockSync) {
            blockSync = await this.blockSyncService.create({ rpcUrl: this.rpcUrl, lastSync: parseInt(process.env.EVM_START_BLOCK) });
        }
        // checking force latest block config
        const startBlockConfig = process.env.EVM_START_BLOCK_CONFIG;
        if (startBlockConfig === 'latest') {
            const latestBlockNumber = await this.provider.getBlockNumber();
            this.logger.warn("force running latest block from network " + latestBlockNumber);
            this.blockSyncService.updateLastSync(this.rpcUrl, latestBlockNumber);
            this.detectInfo.blockNumber = latestBlockNumber;
            this.confirmInfo.blockNumber = latestBlockNumber;
        } else if (startBlockConfig === 'config') {
            this.logger.warn("force running start block from config " + process.env.EVM_START_BLOCK);
            this.updateLastSyncBlock(parseInt(process.env.EVM_START_BLOCK));
            this.detectInfo.blockNumber = parseInt(process.env.EVM_START_BLOCK);
            this.confirmInfo.blockNumber = parseInt(process.env.EVM_START_BLOCK);
        } else {
            this.logger.warn('running start block from db ' + blockSync.lastSync);
            this.detectInfo.blockNumber = blockSync.lastSync;
            this.confirmInfo.blockNumber = blockSync.lastSync;
        }
        this.detectInfo.flag = false; this.confirmInfo.flag = false;
    }

    @Cron(CronExpression.EVERY_10_SECONDS)
    async detect() {
        if (this.detectInfo.flag || this.disabled) {
            return;
        }
        this.detectInfo.flag = true;

        const lastDetectedBlock = this.detectInfo.blockNumber;

        // Get the latest block number
        const latestDetectedBlockNumber = await this.provider.getBlockNumber();

        // Scan each block
        for (let blockNumber = lastDetectedBlock + 1; blockNumber <= latestDetectedBlockNumber; blockNumber++) {
            try {
                this.logger.debug(['DETECT', `Scanning block ${blockNumber}`]);
                // Retrieve the block
                // const block = await this.provider.getBlock(blockNumber);

                // Retrieve transfer event the block's logs
                const logs = await this.provider.getLogs({ fromBlock: blockNumber, toBlock: blockNumber, topics: ['0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef', null, null, null] });

                // Handle the extracted NFT transfer events
                logs.forEach(event => {
                    // Check if the event is an NFT transfer
                    if (event.topics.length === 4) {
                        this.handleNftTransfer(event, 'detected');
                    }
                });
                this.detectInfo.blockNumber = blockNumber;
                //only update last sync for confirm
                // await this.updateLastSyncBlock(blockNumber);
            } catch (error) {
                this.logger.error(['DETECT', `Error scanning block ${blockNumber}:`, error]);
                break;
            }
        }

        this.detectInfo.flag = false;
        return;
    }

    @Cron(CronExpression.EVERY_10_SECONDS)
    async confirm() {
        if (this.confirmInfo.flag || this.disabled) {
            return;
        }
        this.confirmInfo.flag = true;

        const lastConfirmedBlock = this.confirmInfo.blockNumber;

        // Get the latest block number
        const latestConfirmedBlockNumber = (await this.provider.getBlockNumber()) - this.confirmBlock;

        // Scan each block
        for (let blockNumber = lastConfirmedBlock + 1; blockNumber <= latestConfirmedBlockNumber; blockNumber++) {
            try {
                this.logger.debug(['CONFIRM', `Scanning block ${blockNumber}`]);

                // Retrieve transfer event the block's logs
                const logs = await this.provider.getLogs({ fromBlock: blockNumber, toBlock: blockNumber, topics: ['0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef', null, null, null, null, null] });

                // Handle the extracted NFT transfer events
                logs.forEach(event => {
                    // Check if the event is an NFT transfer
                    if (event.topics.length === 4) {
                        this.handleNftTransfer(event, 'confirmed');
                    }
                });
                this.confirmInfo.blockNumber = blockNumber;
                await this.updateLastSyncBlock(blockNumber);
            } catch (error) {
                this.logger.error(['CONFIRM', `Error scanning block ${blockNumber}:`, error]);
                break;
            }
        }

        this.confirmInfo.flag = false;
        return;
    }


    async handleNftTransfer(event: Log, action: 'detected' | 'confirmed') {
        // Extract relevant information from the event
        const contractAddress = ethers.getAddress(event.address).toLowerCase();
        const fromAddress = ethers.getAddress(event.topics[1].substring(26)).toLowerCase();
        const toAddress = ethers.getAddress(event.topics[2].substring(26)).toLowerCase();
        const tokenId = ethers.toBigInt(event.topics[3]).toString();
        // check contract address is supported in erc721
        const erc721 = await this.erc721Service.findOne(contractAddress);
        if (!erc721) {
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

            this.logger.log(action + ' nft transfer OUT with database: ' + JSON.stringify(body));
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
        try {
            await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(message)
            });
        } catch (error) {
            this.logger.error("error while sending webhook request", error);
        }
    }
}
