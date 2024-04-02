import { MonitorRepository } from '@app/shared_modules/monitor/repositories/monitor.repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MonitorService {
  constructor(private readonly monitorRepository: MonitorRepository) {}
}
