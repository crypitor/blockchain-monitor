import { TopicName } from '@app/utils/topicUtils';
import { Controller } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';
import { PolygonService } from './polygon.service';

@Controller()
export class PolygonController {
  constructor(private readonly polygon: PolygonService) {}

  @EventPattern(TopicName.POLYGON_NATIVE_TRANSFER)
  handleNativeTransfer(data: any): void {
    this.polygon.handleNativeTransfer(data);
  }

  @EventPattern(TopicName.POLYGON_ERC20_TRANSFER)
  handleErc20Transfer(data: any): void {
    this.polygon.handleErc20Transfer(data);
  }

  @EventPattern(TopicName.POLYGON_ERC721_TRANSFER)
  handleErc721Transfer(data: any): void {
    this.polygon.handleErc721Transfer(data);
  }
}
