import { TopicName } from '@app/utils/topicUtils';
import { Controller, Logger } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';
import { MantleService } from './mantle.service';

@Controller()
export class MantleController {
  private readonly logger = new Logger(MantleController.name);
  constructor(private readonly mantle: MantleService) {}

  @EventPattern(TopicName.MANTLE_NATIVE_TRANSFER)
  async handleNativeTransfer(data: any) {
    const start = Date.now();
    await this.mantle.handleNativeTransfer(data);
    if (Date.now() - start > 20)
      this.logger.warn(`Handle native transfer in : ${Date.now() - start}`);
  }

  @EventPattern(TopicName.MANTLE_ERC20_TRANSFER)
  async handleErc20Transfer(data: any) {
    const start = Date.now();
    await this.mantle.handleErc20Transfer(data);
    if (Date.now() - start > 20)
      this.logger.warn(`Handle erc20 transfer in : ${Date.now() - start}`);
  }

  @EventPattern(TopicName.MANTLE_ERC721_TRANSFER)
  async handleErc721Transfer(data: any) {
    const start = Date.now();
    await this.mantle.handleErc721Transfer(data);
    if (Date.now() - start > 20)
      this.logger.warn(`Handle erc721 transfer in : ${Date.now() - start}`);
  }
}
