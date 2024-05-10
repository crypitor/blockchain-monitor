import { TopicName } from '@app/utils/topicUtils';
import { Controller, Get, Logger } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';
import { WorkerServiceService } from './worker-service.service';
import { EthereumWorker } from './worker/ethereum.worker';
import { PolygonWorker } from './worker/polygon.worker';

@Controller()
export class WorkerServiceController {
  private readonly logger = new Logger(WorkerServiceController.name);
  constructor(
    private readonly workerServiceService: WorkerServiceService,
    private readonly ethereumWorker: EthereumWorker,
    private readonly polygonWorker: PolygonWorker,
  ) {}

  @Get()
  getHello(): string {
    return this.workerServiceService.getHello();
  }

  async delay(ms: number) {
    return new Promise<void>((resolve) => {
      setTimeout(resolve, ms);
    });
  }

  @EventPattern(TopicName.ETH_DETECTED_BLOCK)
  async ethDetectBlock(data: any) {
    await Promise.race([
      this.ethereumWorker.ethHandleDetectedBlock(data),
      this.delay(100).then(() => {
        return;
      }),
    ]);
  }

  @EventPattern(TopicName.ETH_CONFIRMED_BLOCK)
  async ethConfirmBlock(data: any) {
    await Promise.race([
      this.ethereumWorker.ethHandleConfirmedBlock(data),
      this.delay(100).then(() => {
        return;
      }),
    ]);
  }

  @EventPattern(TopicName.POLYGON_DETECTED_BLOCK)
  async polygonDetectBlock(data: any) {
    await Promise.race([
      this.polygonWorker.ethHandleDetectedBlock(data),
      this.delay(100).then(() => {
        return;
      }),
    ]);
  }

  @EventPattern(TopicName.POLYGON_CONFIRMED_BLOCK)
  async polygonConfirmBlock(data: any) {
    await Promise.race([
      this.polygonWorker.ethHandleConfirmedBlock(data),
      this.delay(100).then(() => {
        return;
      }),
    ]);
  }
}
