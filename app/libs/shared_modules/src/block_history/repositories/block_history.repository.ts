import { MonitorNetwork } from '@app/shared_modules/monitor/schemas/monitor.schema';
import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { BlockHistory } from '../schemas/block_history.schema';

export class BlockHistoryRepository {
  static repositories: Map<MonitorNetwork, BlockHistoryRepository> = new Map();

  static getRepository(network: MonitorNetwork): BlockHistoryRepository {
    return BlockHistoryRepository.repositories[network];
  }

  constructor(
    network: MonitorNetwork,
    private readonly model: Model<BlockHistory>,
  ) {
    BlockHistoryRepository.repositories[network] = this;
  }

  async findByBlockNumber(blockNumber: string): Promise<BlockHistory[]> {
    return this.model.find({ blockNumber: blockNumber });
  }

  async saveBlockHistory(blockHistory: BlockHistory): Promise<BlockHistory> {
    return new this.model(blockHistory).save();
  }

  async getBlockHistory(
    limit: number,
    offset: number,
  ): Promise<BlockHistory[]> {
    return this.model
      .find({})
      .limit(limit)
      .skip(offset)
      .sort({ dateCreated: -1 });
  }

  async findErrorBlockHistory(
    limit: number,
    offset: number,
  ): Promise<BlockHistory[]> {
    return this.model
      .find({ isError: true })
      .limit(limit)
      .skip(offset)
      .sort({ dateCreated: 1 });
  }
}

@Injectable()
export class EthBlockHistoryRepository extends BlockHistoryRepository {
  constructor(@Inject('ETH_BLOCK_HISTORY_MODEL') model: Model<BlockHistory>) {
    super(MonitorNetwork.Ethereum, model);
  }
}

@Injectable()
export class BscBlockHistoryRepository extends BlockHistoryRepository {
  constructor(@Inject('BSC_BLOCK_HISTORY_MODEL') model: Model<BlockHistory>) {
    super(MonitorNetwork.BSC, model);
  }
}

@Injectable()
export class PolygonBlockHistoryRepository extends BlockHistoryRepository {
  constructor(
    @Inject('POLYGON_BLOCK_HISTORY_MODEL') model: Model<BlockHistory>,
  ) {
    super(MonitorNetwork.Polygon, model);
  }
}
