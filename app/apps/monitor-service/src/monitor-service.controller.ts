import { Controller, Get } from '@nestjs/common';
import { MonitorServiceService } from './monitor-service.service';

@Controller()
export class MonitorServiceController {
  constructor(private readonly monitorServiceService: MonitorServiceService) {}

  @Get()
  getHello(): string {
    return this.monitorServiceService.getHello();
  }
}
