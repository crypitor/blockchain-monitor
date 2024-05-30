import { TopicName } from '@app/utils/topicUtils';
import { Controller, Logger } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';
import { BscWorker } from '../worker/bsc.worker';

@Controller()
export class BscWorkerController {
  private readonly logger = new Logger(BscWorkerController.name);
  constructor(private readonly bscWorker: BscWorker) {}

  async delay(ms: number) {
    return new Promise<void>((resolve) => {
      setTimeout(resolve, ms);
    });
  }

  @EventPattern(TopicName.BSC_DETECTED_BLOCK)
  async bscDetectBlock(data: any) {
    await Promise.race([
      this.bscWorker.handleBlock(data),
      this.delay(200).then(() => {
        return;
      }),
    ]);
  }
}
