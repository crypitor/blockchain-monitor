import { Controller } from '@nestjs/common';
import { MonitorService } from './monitor.service';

@Controller('monitor')
export class MonitorController {
  constructor(private readonly monitorService: MonitorService) {}
}
