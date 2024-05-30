import { BlockTransportDto } from '@app/utils/dto/transport.dto';
import { TopicName } from '@app/utils/topicUtils';
import { Controller, Logger } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';
import { EthereumWorker } from '../worker/ethereum.worker';

@Controller()
export class EthereumWorkerController {
  private readonly logger = new Logger(EthereumWorkerController.name);
  constructor(private readonly ethereumWorker: EthereumWorker) {}

  async delay(ms: number) {
    return new Promise<void>((resolve) => {
      setTimeout(resolve, ms);
    });
  }

  @EventPattern(TopicName.ETH_DETECTED_BLOCK)
  async ethDetectBlock(data: BlockTransportDto) {
    await Promise.race([
      this.ethereumWorker.handleBlock(data),
      this.delay(500).then(() => {
        return;
      }),
    ]);
  }
}
