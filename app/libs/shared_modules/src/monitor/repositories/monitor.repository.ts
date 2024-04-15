import { Inject, Injectable } from '@nestjs/common';
import { ListMonitorDto } from 'apps/onebox/src/modules/monitor/dto/monitor.dto';
import { Model } from 'mongoose';
import { Monitor } from '../schemas/monitor.schema';

@Injectable()
export class MonitorRepository {
  constructor(
    @Inject('MONITOR_MODEL') private readonly monitorModel: Model<Monitor>,
  ) {}

  async findById(id: string): Promise<Monitor> {
    return this.monitorModel.findOne({ monitorId: id });
  }

  async saveMonitor(monitor: Monitor): Promise<Monitor> {
    return new this.monitorModel(monitor).save();
  }

  async listMonitorsByProject(projectId: string): Promise<Monitor[]> {
    return this.monitorModel.find({ projectId: projectId });
  }

  async listMonitors(filter: ListMonitorDto): Promise<Monitor[]> {
    const match = {
      projectId: filter.projectId,
    };
    if (filter.network) {
      match['network'] = filter.network;
    }

    if (filter.search && filter.search !== '') {
      if (filter.search.startsWith('mo_')) {
        match['monitorId'] = filter.search;
      } else {
        match['name'] = { $regex: filter.search, $options: 'i' };
      }
    }

    return this.monitorModel
      .find(match)
      .sort({ _id: -1 })
      .limit(filter.limit)
      .skip(filter.offset)
      .exec();
  }

  async deleteMonitor(monitorId: string): Promise<boolean> {
    return this.monitorModel
      .deleteOne({ monitorId: monitorId })
      .then((result) => result.deletedCount > 0);
  }

  async updateMonitor(
    monitorId: string,
    updateMonitor: Map<string, any>,
  ): Promise<Monitor> {
    return this.monitorModel
      .findOneAndUpdate(
        { monitorId: monitorId },
        {
          $set: {
            ...updateMonitor,
          },
        },
        {
          new: true,
        },
      )
      .exec();
  }
}
