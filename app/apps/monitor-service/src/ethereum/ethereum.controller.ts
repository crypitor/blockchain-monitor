import { TopicName } from '@app/utils/topicUtils';
import { Controller, Logger } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';
import { EthereumService } from './ethereum.service';

@Controller()
export class EthereumController {
  private readonly logger = new Logger(EthereumController.name);
  constructor(private readonly ethereum: EthereumService) {}

  @EventPattern(TopicName.ETH_NATIVE_TRANSFER)
  async handleNativeTransfer(data: any): Promise<void> {
    const start = Date.now();
    await this.ethereum.handleNativeTransfer(data);
    if (Date.now() - start > 20)
      this.logger.warn(`Handle native transfer in : ${Date.now() - start}`);
  }

  @EventPattern(TopicName.ETH_ERC20_TRANSFER)
  async handleErc20Transfer(data: any): Promise<void> {
    const start = Date.now();
    await this.ethereum.handleErc20Transfer(data);
    if (Date.now() - start > 20)
      this.logger.warn(`Handle erc20 transfer in : ${Date.now() - start}`);
  }

  @EventPattern(TopicName.ETH_ERC721_TRANSFER)
  async handleErc721Transfer(data: any): Promise<void> {
    const start = Date.now();
    await this.ethereum.handleErc721Transfer(data);
    if (Date.now() - start > 20)
      this.logger.warn(`Handle erc721 transfer in : ${Date.now() - start}`);
  }
}
