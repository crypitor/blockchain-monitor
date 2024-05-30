import { TopicName } from '@app/utils/topicUtils';
import { Controller, Logger } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';
import { AvaxWorker } from '../worker/avax.worker';

@Controller()
export class AvaxWorkerController {
  private readonly logger = new Logger(AvaxWorkerController.name);
  constructor(private readonly avaxWorker: AvaxWorker) {}

  async delay(ms: number) {
    return new Promise<void>((resolve) => {
      setTimeout(resolve, ms);
    });
  }

  @EventPattern(TopicName.AVAX_DETECTED_BLOCK)
  async avaxDetectBlock(data: any) {
    await Promise.race([
      this.avaxWorker.handleBlock(data),
      this.delay(500).then(() => {
        return;
      }),
    ]);
  }
}
