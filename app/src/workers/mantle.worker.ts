
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
export class MantleWorker {
    private readonly logger = new Logger(MantleWorker.name);
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
        if (process.env.MANTLE_DISABLE === 'true') {
            console.log('disable')
            return;
        }
        this.rpcUrl = process.env.MANTLE_WEB3_PROVIDER_URL;
        this.provider = new ethers.JsonRpcProvider(process.env.MANTLE_WEB3_PROVIDER_URL);
        this.blockSyncService = blockSyncService;
        this.walletService = walletService;
        this.erc721Service = erc721Service;
        this.initWorker();
    }

    async initWorker() {
        this.detectInfo.flag = true; this.confirmInfo.flag = true;
        let blockSync = await this.blockSyncService.findOne(this.rpcUrl);
        if (!blockSync) {
            blockSync = await this.blockSyncService.create({ rpcUrl: this.rpcUrl, lastSync: parseInt(process.env.MANTLE_START_BLOCK) });
        }
        // checking force latest block config
        const startBlockConfig = process.env.MANTLE_START_BLOCK_CONFIG;
        if (startBlockConfig === 'latest') {
            const latestBlockNumber = await this.provider.getBlockNumber();
            this.logger.warn("force running latest block from network " + latestBlockNumber);
            this.blockSyncService.updateLastSync(this.rpcUrl, latestBlockNumber);
            this.detectInfo.blockNumber = latestBlockNumber;
            this.confirmInfo.blockNumber = latestBlockNumber;
        } else if (startBlockConfig === 'config') {
            this.logger.warn("force running start block from config " + process.env.MANTLE_START_BLOCK);
            this.updateLastSyncBlock(parseInt(process.env.MANTLE_START_BLOCK));
            this.detectInfo.blockNumber = parseInt(process.env.MANTLE_START_BLOCK);
            this.confirmInfo.blockNumber = parseInt(process.env.MANTLE_START_BLOCK);
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

        let lastDetectedBlock = this.detectInfo.blockNumber + 1;

        // Get the latest block number
        const latestDetectedBlockNumber = await this.provider.getBlockNumber();

        while (lastDetectedBlock < latestDetectedBlockNumber) {
            try {
                if (lastDetectedBlock <= latestDetectedBlockNumber - 1000) {
                    this.logger.debug("DETECT scanning block from " + lastDetectedBlock + " to " + (lastDetectedBlock + 1000));
                    // Retrieve transfer event the 1000 block's logs
                    const logs = await this.provider.getLogs({ fromBlock: lastDetectedBlock, toBlock: lastDetectedBlock + 1000, topics: ['0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef'] });
                    // Handle the extracted NFT transfer events
                    logs.forEach(event => {
                        // Check if the event is an NFT transfer
                        if (event.topics.length === 4) {
                            this.handleNftTransfer(event, 'detected');
                        }
                    });
                    lastDetectedBlock = lastDetectedBlock + 1000;
                } else {
                    this.logger.debug("DETECT scanning block from " + lastDetectedBlock + " to " + latestDetectedBlockNumber);
                    // Retrieve transfer event the 1000 block's logs
                    const logs = await this.provider.getLogs({ fromBlock: lastDetectedBlock + 1, toBlock: latestDetectedBlockNumber, topics: ['0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef', null, null, null] });
                    // Handle the extracted NFT transfer events
                    logs.forEach(event => {
                        // Check if the event is an NFT transfer
                        if (event.topics.length === 4) {
                            this.handleNftTransfer(event, 'detected');
                        }
                    });
                    lastDetectedBlock = latestDetectedBlockNumber;
                }
                this.detectInfo.blockNumber = lastDetectedBlock;
                this.updateLastSyncBlock(lastDetectedBlock);
            } catch (error) {
                this.logger.error(error);
            }
        }

        this.detectInfo.flag = false;
        return;
    }

    // @Cron(CronExpression.EVERY_10_SECONDS)
    // async confirm() {
    //     if (this.confirmInfo.flag || this.disabled) {
    //         return;
    //     }
    //     this.confirmInfo.flag = true;

    //     let lastConfirmedBlock = this.confirmInfo.blockNumber;

    //     // Get the latest block number
    //     const latestConfirmedBlockNumber = (await this.provider.getBlockNumber()) - this.confirmBlock;

    //     while (lastConfirmedBlock < latestConfirmedBlockNumber) {
    //         try {
    //             if (lastConfirmedBlock <= latestConfirmedBlockNumber - 1000) {
    //                 this.logger.debug("CONFIRM scanning block from " + lastConfirmedBlock + " to " + (lastConfirmedBlock + 1000));
    //                 // Retrieve transfer event the 1000 block's logs
    //                 const logs = await this.provider.getLogs({ fromBlock: lastConfirmedBlock + 1, toBlock: lastConfirmedBlock + 1000, topics: ['0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef', null, null, null, null, null] });
    //                 // Handle the extracted NFT transfer events
    //                 logs.forEach(event => {
    //                     // Check if the event is an NFT transfer
    //                     if (event.topics.length === 4) {
    //                         this.handleNftTransfer(event, 'confirmed');
    //                     }
    //                 });
    //                 lastConfirmedBlock = lastConfirmedBlock + 1000;
    //             } else {
    //                 this.logger.debug("CONFIRM scanning block from " + lastConfirmedBlock + " to " + latestConfirmedBlockNumber);
    //                 // Retrieve transfer event the 1000 block's logs
    //                 const logs = await this.provider.getLogs({ fromBlock: lastConfirmedBlock + 1, toBlock: latestConfirmedBlockNumber, topics: ['0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef', null, null, null, null, null] });
    //                 // Handle the extracted NFT transfer events
    //                 logs.forEach(event => {
    //                     // Check if the event is an NFT transfer
    //                     if (event.topics.length === 4) {
    //                         this.handleNftTransfer(event, 'confirmed');
    //                     }
    //                 });
    //                 lastConfirmedBlock = latestConfirmedBlockNumber;
    //             }
    //             this.confirmInfo.blockNumber = lastConfirmedBlock;
    //             this.updateLastSyncBlock(this.confirmInfo.blockNumber);
    //         } catch (error) {
    //             this.logger.error(error);
    //         }
    //     }

    //     this.confirmInfo.flag = false;
    //     return;
    // }


    async handleNftTransfer(event: Log, action: 'detected' | 'confirmed') {
        // Extract relevant information from the event
        const contractAddress = ethers.getAddress(event.address).toLowerCase();
        const fromAddress = ethers.getAddress(event.topics[1].substring(26)).toLowerCase();
        const toAddress = ethers.getAddress(event.topics[2].substring(26)).toLowerCase();
        const tokenId = ethers.toBigInt(event.topics[3]).toString();
        // check contract address is supported in erc721
        const erc721 = await this.erc721Service.findOne(contractAddress);
        if (!erc721) {
            console.log("unsupport erc721", event.transactionHash)
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

            this.logger.debug(action + ' nft transfer IN with database: ' + JSON.stringify(body));
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
