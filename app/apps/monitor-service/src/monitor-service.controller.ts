import { TopicName } from '@app/utils/topicUtils';
import { Controller } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';
import { MonitorServiceService } from './monitor-service.service';

@Controller()
export class MonitorServiceController {
  constructor(private readonly monitorServiceService: MonitorServiceService) {}

  @EventPattern('blockchain-event')
  getHello(data: any): string {
    return this.monitorServiceService.getHello(data);
  }

  @EventPattern(TopicName.ETH_NATIVE_TRANSFER)
  handleNativeTransfer(data: any): void {
    console.log(data);
    this.monitorServiceService.handleNativeTransfer(data);
  }

  @EventPattern(TopicName.ETH_ERC20_TRANSFER)
  handleErc20Transfer(data: any): void {
    this.monitorServiceService.handleErc20Transfer(data);
  }

  @EventPattern(TopicName.ETH_ERC721_TRANSFER)
  handleErc721Transfer(data: any): string {
    return this.monitorServiceService.getHello(data);
  }
}
