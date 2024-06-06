import { MonitorNetwork } from '../../../src';
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
    monitorId: string,
    associatedAddress: string,
    limit: number,
    offset: number,
  ): Promise<EventHistory[]> {
    return this.model
      .find({ monitorId: monitorId, associatedAddress: associatedAddress })
      .limit(limit)
      .skip(offset)
      .sort({ dateCreated: -1 });
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
    limit: number,
    offset: number,
  ): Promise<EventHistory[]> {
    return this.model
      .find({ monitorId: monitorId, hash: hash })
      .limit(limit)
      .skip(offset)
      .sort({ dateCreated: -1 });
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

@Injectable()
export class PolygonEventHistoryRepository extends EventHistoryRepository {
  constructor(
    @Inject('POLYGON_EVENT_HISTORY_MODEL') model: Model<EventHistory>,
  ) {
    super(MonitorNetwork.Polygon, model);
  }
}

@Injectable()
export class AvaxEventHistoryRepository extends EventHistoryRepository {
  constructor(@Inject('AVAX_EVENT_HISTORY_MODEL') model: Model<EventHistory>) {
    super(MonitorNetwork.Avalanche, model);
  }
}

@Injectable()
export class MantleEventHistoryRepository extends EventHistoryRepository {
  constructor(
    @Inject('MANTLE_EVENT_HISTORY_MODEL') model: Model<EventHistory>,
  ) {
    super(MonitorNetwork.Mantle, model);
  }
}
