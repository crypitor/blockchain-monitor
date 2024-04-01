import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { Monitor } from '../schemas/monitor.schema';

@Injectable()
export class MonitorRepository {
  constructor(
    @Inject('MONITOR_MODEL') private readonly monitorModel: Model<Monitor>,
  ) {}

  async findById(id: string): Promise<Monitor> {
    return await this.monitorModel.findOne({ monitorId: id });
  }

  async saveMonitor(monitor: Monitor): Promise<Monitor> {
    return await new this.monitorModel(monitor).save();
  }

  async listMonitorsByProject(projectId: string): Promise<Monitor[]> {
    return await this.monitorModel.find({ projectId: projectId });
  }
}
