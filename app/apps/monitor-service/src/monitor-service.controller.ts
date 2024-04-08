import { Controller } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';
@Controller()
export class MonitorServiceController {
  @EventPattern('blockchain-event')
  getHello(data: any) {
    console.log('data', data);
  }
}
