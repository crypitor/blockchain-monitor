import { Inject, Injectable, Logger } from '@nestjs/common';
import { Model } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { CreateEthMonitorDto } from './dto/eth.create-monitor.dto';
import { EthMonitor } from '@app/shared_modules/eth.monitor/schemas/eth.monitor.schema';

@Injectable()
export class EthMonitorService {
  private readonly logger = new Logger(EthMonitorService.name);
  constructor(
    @Inject('ETH_MONITOR_MODEL')
    private readonly ethMonitorModel: Model<EthMonitor>,
  ) {}

  async create(
    user: any,
    createEthMonitorDto: CreateEthMonitorDto,
  ): Promise<EthMonitor> {
    const createdEthMonitor = new this.ethMonitorModel({
      ...createEthMonitorDto,
      userId: user.userId,
      monitorId: uuidv4(),
    });
    try {
      return await createdEthMonitor.save();
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get all EthMonitor.
   *
   * @returns {EthMonitor[]}
   */
  async findAll(): Promise<EthMonitor[]> {
    return this.ethMonitorModel.find().exec();
  }

  /**
   * Get all EthMonitor.
   *
   * @returns {EthMonitor[]}
   */
  async findAllByAddress(address: string): Promise<EthMonitor[]> {
    return this.ethMonitorModel.find({ address: address }).exec();
  }

  /**
   * Find a single EthMonitor by their address.
   *
   * @param address The EthMonitor address to filter by.
   * @returns {EthMonitor}
   */
  async findOne(address: string): Promise<EthMonitor | undefined> {
    return this.ethMonitorModel.findOne({ address: address });
  }

  async deleteOne(monitorId: string): Promise<void> {
    try {
      await this.ethMonitorModel.deleteOne({ monitorId: monitorId });
    } catch (error) {
      throw error;
    }
  }
}
