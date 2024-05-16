import { TopicName } from '@app/utils/topicUtils';
import { Controller, Get, Logger } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';
import { WorkerServiceService } from './worker-service.service';
import { EthereumWorker } from './worker/ethereum.worker';
import { PolygonWorker } from './worker/polygon.worker';
import { BlockTransportDto } from '@app/utils/dto/transport.dto';
import { AvaxWorker } from './worker/avax.worker';

@Controller()
export class WorkerServiceController {
  private readonly logger = new Logger(WorkerServiceController.name);
  constructor(
    private readonly workerServiceService: WorkerServiceService,
    private readonly ethereumWorker: EthereumWorker,
    private readonly polygonWorker: PolygonWorker,
    private readonly avaxWorker: AvaxWorker,
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
  async ethDetectBlock(data: BlockTransportDto) {
    await Promise.race([
      this.ethereumWorker.handleBlock(data),
      this.delay(200).then(() => {
        return;
      }),
    ]);
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

  @EventPattern(TopicName.AVAX_DETECTED_BLOCK)
  async avaxDetectBlock(data: any) {
    await Promise.race([
      this.avaxWorker.handleBlock(data),
      this.delay(200).then(() => {
        return;
      }),
    ]);
  }
}
