import { TopicName } from '@app/utils/topicUtils';
import { Controller, Logger } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';
import { MantleWorker } from '../worker/mantle.worker';

@Controller()
export class MantleWorkerController {
  private readonly logger = new Logger(MantleWorkerController.name);
  constructor(private readonly mantleWorker: MantleWorker) {}

  async delay(ms: number) {
    return new Promise<void>((resolve) => {
      setTimeout(resolve, ms);
    });
  }

  @EventPattern(TopicName.MANTLE_DETECTED_BLOCK)
  async mantleDetectBlock(data: any) {
    await Promise.race([
      this.mantleWorker.handleBlock(data),
      this.delay(500).then(() => {
        return;
      }),
    ]);
  }
}
