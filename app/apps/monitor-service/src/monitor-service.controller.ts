import { Controller, Get } from '@nestjs/common';
import { MonitorServiceService } from './monitor-service.service';
import { EventPattern } from '@nestjs/microservices';

@Controller()
export class MonitorServiceController {
  constructor(private readonly monitorServiceService: MonitorServiceService) {}

  @EventPattern('blockchain-event')
  getHello(data: any): string {
    return this.monitorServiceService.getHello(data);
  }
}
