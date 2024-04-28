import { Controller, Get } from '@nestjs/common';
import { WorkerServiceService } from './worker-service.service';
import { EventPattern } from '@nestjs/microservices';
import { TopicName } from '@app/utils/topicUtils';
import { EthereumWorker } from './worker/ethereum.worker';
import { PolygonWorker } from './worker/polygon.worker';

@Controller()
export class WorkerServiceController {
  constructor(
    private readonly workerServiceService: WorkerServiceService,
    private readonly ethereumWorker: EthereumWorker,
    private readonly polygonWorker: PolygonWorker,
  ) {}

  @Get()
  getHello(): string {
    return this.workerServiceService.getHello();
  }

  @EventPattern(TopicName.ETH_DETECTED_BLOCK)
  async ethDetectBlock(data: any) {
    this.ethereumWorker.ethHandleDetectedBlock(data);
  }

  @EventPattern(TopicName.ETH_CONFIRMED_BLOCK)
  async ethConfirmBlock(data: any) {
    this.polygonWorker.ethHandleConfirmedBlock(data);
  }

  @EventPattern(TopicName.POLYGON_DETECTED_BLOCK)
  async polygonDetectBlock(data: any) {
    this.polygonWorker.ethHandleDetectedBlock(data);
  }

  @EventPattern(TopicName.POLYGON_CONFIRMED_BLOCK)
  async polygonConfirmBlock(data: any) {
    this.polygonWorker.ethHandleConfirmedBlock(data);
  }
}
