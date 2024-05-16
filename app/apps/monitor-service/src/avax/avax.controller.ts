import { TopicName } from '@app/utils/topicUtils';
import { Controller, Logger } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';
import { AvaxService } from './avax.service';

@Controller()
export class AvaxController {
  private readonly logger = new Logger(AvaxController.name);
  constructor(private readonly avax: AvaxService) {}

  @EventPattern(TopicName.AVAX_NATIVE_TRANSFER)
  async handleNativeTransfer(data: any) {
    const start = Date.now();
    await this.avax.handleNativeTransfer(data);
    if (Date.now() - start > 20)
      this.logger.warn(`Handle native transfer in : ${Date.now() - start}`);
  }

  @EventPattern(TopicName.AVAX_ERC20_TRANSFER)
  async handleErc20Transfer(data: any) {
    const start = Date.now();
    await this.avax.handleErc20Transfer(data);
    if (Date.now() - start > 20)
      this.logger.warn(`Handle erc20 transfer in : ${Date.now() - start}`);
  }

  @EventPattern(TopicName.AVAX_ERC721_TRANSFER)
  async handleErc721Transfer(data: any) {
    const start = Date.now();
    await this.avax.handleErc721Transfer(data);
    if (Date.now() - start > 20)
      this.logger.warn(`Handle erc721 transfer in : ${Date.now() - start}`);
  }
}
