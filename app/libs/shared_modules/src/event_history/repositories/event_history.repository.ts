import { MonitorNetwork } from '@app/shared_modules/monitor/schemas/monitor.schema';
import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { EventHistory } from '../schemas/event_history.schema';

export class EventHistoryRepository {
  static repositories: Map<MonitorNetwork, EventHistoryRepository> = new Map();

  static getRepository(network: MonitorNetwork): EventHistoryRepository {
    return EventHistoryRepository.repositories[network];
  }

  constructor(
    network: MonitorNetwork,
    private readonly model: Model<EventHistory>,
  ) {
    EventHistoryRepository.repositories[network] = this;
  }

  async findByEventId(eventId: string): Promise<EventHistory> {
    return this.model.findOne({ eventId: eventId });
  }

  async saveEventHistory(eventHistory: EventHistory): Promise<EventHistory> {
    return new this.model(eventHistory).save();
  }

  async findByMonitorAndAssociatedAddress(
    monitor: string,
    associatedAddress: string,
  ): Promise<EventHistory[]> {
    return this.model.find({
      monitorId: monitor,
      associatedAddress: associatedAddress,
    });
  }

  async getEventHistory(
    monitorId: string,
    limit: number,
    offset: number,
  ): Promise<EventHistory[]> {
    return this.model
      .find({ monitorId: monitorId })
      .limit(limit)
      .skip(offset)
      .sort({ dateCreated: -1 });
  }

  async findEventHistoryByMonitorAndHash(
    monitorId: string,
    hash: string,
  ): Promise<EventHistory[]> {
    return this.model.find({ monitorId: monitorId, hash: hash });
  }

  async pushConfirmDeliveryId(eventId: string, deliveryId: string) {
    return this.model.updateOne(
      { eventId: eventId },
      {
        $push: {
          deliveryIds: deliveryId,
        },
        $set: {
          confirm: true,
        },
      },
    );
  }
}

@Injectable()
export class EthEventHistoryRepository extends EventHistoryRepository {
  constructor(@Inject('ETH_EVENT_HISTORY_MODEL') model: Model<EventHistory>) {
    super(MonitorNetwork.Ethereum, model);
  }
}

@Injectable()
export class BscEventHistoryRepository extends EventHistoryRepository {
  constructor(@Inject('BSC_EVENT_HISTORY_MODEL') model: Model<EventHistory>) {
    super(MonitorNetwork.BSC, model);
  }
}
