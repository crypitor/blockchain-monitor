import { TopicName } from '@app/utils/topicUtils';
import { Controller, Logger } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';
import { PolygonService } from './polygon.service';

@Controller()
export class PolygonController {
  private readonly logger = new Logger(PolygonController.name);
  constructor(private readonly polygon: PolygonService) {}

  @EventPattern(TopicName.POLYGON_NATIVE_TRANSFER)
  async handleNativeTransfer(data: any) {
    const start = Date.now();
    await this.polygon.handleNativeTransfer(data);
    if (Date.now() - start > 20)
      this.logger.warn(`Handle native transfer in : ${Date.now() - start}`);
  }

  @EventPattern(TopicName.POLYGON_ERC20_TRANSFER)
  async handleErc20Transfer(data: any) {
    const start = Date.now();
    await this.polygon.handleErc20Transfer(data);
    if (Date.now() - start > 20)
      this.logger.warn(`Handle erc20 transfer in : ${Date.now() - start}`);
  }

  @EventPattern(TopicName.POLYGON_ERC721_TRANSFER)
  async handleErc721Transfer(data: any) {
    const start = Date.now();
    await this.polygon.handleErc721Transfer(data);
    if (Date.now() - start > 20)
      this.logger.warn(`Handle erc721 transfer in : ${Date.now() - start}`);
  }
}
