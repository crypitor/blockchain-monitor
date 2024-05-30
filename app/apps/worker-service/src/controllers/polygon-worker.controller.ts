import { TopicName } from '@app/utils/topicUtils';
import { Controller, Logger } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';
import { PolygonWorker } from '../worker/polygon.worker';

@Controller()
export class PolygonWorkerController {
  private readonly logger = new Logger(PolygonWorkerController.name);
  constructor(private readonly polygonWorker: PolygonWorker) {}

  async delay(ms: number) {
    return new Promise<void>((resolve) => {
      setTimeout(resolve, ms);
    });
  }

  @EventPattern(TopicName.POLYGON_DETECTED_BLOCK)
  async polygonDetectBlock(data: any) {
    await Promise.race([
      this.polygonWorker.handleBlock(data),
      this.delay(200).then(() => {
        return;
      }),
    ]);
  }
}
