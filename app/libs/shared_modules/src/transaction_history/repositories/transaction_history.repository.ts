import { MonitorNetwork } from '@app/shared_modules/monitor/schemas/monitor.schema';
import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { TransactionHistory } from '../schemas/transaction_history.schema';

export class TransactionHistoryRepository {
  static repositories: Map<MonitorNetwork, TransactionHistoryRepository> =
    new Map();

  static getRepository(network: MonitorNetwork): TransactionHistoryRepository {
    return TransactionHistoryRepository.repositories[network];
  }

  constructor(
    network: MonitorNetwork,
    private readonly model: Model<TransactionHistory>,
  ) {
    TransactionHistoryRepository.repositories[network] = this;
  }

  async findByUniqueId(uniqueId: string): Promise<TransactionHistory> {
    return this.model.findOne({ uniqueId: uniqueId });
  }

  async saveTransactionHistory(
    transactionHistory: TransactionHistory,
  ): Promise<TransactionHistory> {
    return new this.model(transactionHistory).save();
  }

  async findByMonitorAndAssociatedAddress(
    monitor: string,
    associatedAddress: string,
  ): Promise<TransactionHistory[]> {
    return this.model.find({
      monitorId: monitor,
      associatedAddress: associatedAddress,
    });
  }

  async findByMonitorId(monitorId: string): Promise<TransactionHistory[]> {
    return this.model.find({ monitorId: monitorId });
  }

  async getTransactionHistory(
    monitorId: string,
    limit: number,
    offset: number,
  ): Promise<TransactionHistory[]> {
    return this.model
      .find({ monitorId: monitorId })
      .limit(limit)
      .skip(offset)
      .sort({ dateCreated: -1 });
  }

  async findTransactionHistoryByMonitorAndHash(
    monitorId: string,
    hash: string,
  ): Promise<TransactionHistory[]> {
    return this.model.find({ monitorId: monitorId, hash: hash });
  }
}

@Injectable()
export class EthTransactionHistoryRepository extends TransactionHistoryRepository {
  constructor(
    @Inject('ETH_TRANSACTION_HISTORY_MODEL') model: Model<TransactionHistory>,
  ) {
    super(MonitorNetwork.Ethereum, model);
  }
}

@Injectable()
export class BscTransactionHistoryRepository extends TransactionHistoryRepository {
  constructor(
    @Inject('BSC_TRANSACTION_HISTORY_MODEL') model: Model<TransactionHistory>,
  ) {
    super(MonitorNetwork.BSC, model);
  }
}
