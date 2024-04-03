import { TopicName } from '@app/utils/topicUtils';
import { Controller } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';
import { EthereumService } from './ethereum.service';

@Controller()
export class EthereumController {
  constructor(private readonly ethereum: EthereumService) {}

  @EventPattern(TopicName.ETH_NATIVE_TRANSFER)
  handleNativeTransfer(data: any): void {
    console.log(data);
    this.ethereum.handleNativeTransfer(data);
  }

  @EventPattern(TopicName.ETH_ERC20_TRANSFER)
  handleErc20Transfer(data: any): void {
    this.ethereum.handleErc20Transfer(data);
  }

  @EventPattern(TopicName.ETH_ERC721_TRANSFER)
  handleErc721Transfer(data: any): void {
    this.ethereum.handleErc721Transfer(data);
  }
}
