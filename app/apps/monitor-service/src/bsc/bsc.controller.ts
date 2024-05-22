import { TopicName } from '@app/utils/topicUtils';
import { Controller, Logger } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';
import { BscService } from './bsc.service';

@Controller()
export class BscController {
  private readonly logger = new Logger(BscController.name);
  constructor(private readonly service: BscService) {}

  @EventPattern(TopicName.BSC_NATIVE_TRANSFER)
  async handleNativeTransfer(data: any) {
    const start = Date.now();
    await this.service.handleNativeTransfer(data);
    if (Date.now() - start > 20)
      this.logger.warn(`Handle native transfer in : ${Date.now() - start}`);
  }

  @EventPattern(TopicName.BSC_ERC20_TRANSFER)
  async handleErc20Transfer(data: any) {
    const start = Date.now();
    await this.service.handleErc20Transfer(data);
    if (Date.now() - start > 20)
      this.logger.warn(`Handle erc20 transfer in : ${Date.now() - start}`);
  }

  @EventPattern(TopicName.BSC_ERC721_TRANSFER)
  async handleErc721Transfer(data: any) {
    const start = Date.now();
    await this.service.handleErc721Transfer(data);
    if (Date.now() - start > 20)
      this.logger.warn(`Handle erc721 transfer in : ${Date.now() - start}`);
  }
}
