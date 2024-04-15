import { Controller, Get } from '@nestjs/common';
import { WorkerServiceService } from './worker-service.service';
import { EventPattern } from '@nestjs/microservices';
import { TopicName } from '@app/utils/topicUtils';
import { EthereumWorker } from './worker/ethereum.worker';

@Controller()
export class WorkerServiceController {
  constructor(
    private readonly workerServiceService: WorkerServiceService,
    private readonly ethereumWorker: EthereumWorker,
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
    this.ethereumWorker.ethHandleConfirmedBlock(data);
  }
}
