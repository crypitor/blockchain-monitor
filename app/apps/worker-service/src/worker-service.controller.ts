import { Controller, Get } from '@nestjs/common';
import { WorkerServiceService } from './worker-service.service';

@Controller()
export class WorkerServiceController {
  constructor(private readonly workerServiceService: WorkerServiceService) {}

  @Get()
  getHello(): string {
    return this.workerServiceService.getHello();
  }
}
