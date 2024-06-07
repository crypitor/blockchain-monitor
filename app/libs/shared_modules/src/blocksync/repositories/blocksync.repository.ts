import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { CreateBlockSyncDto } from '../dto/blocksync.dto';
import { BlockSync } from '../schemas/blocksync.schema';

@Injectable()
export class BlockSyncRepository {
  constructor(
    @Inject('BLOCKSYNC_MODEL') private readonly blockSync: Model<BlockSync>,
  ) {}

  async create(createBlockSyncDto: CreateBlockSyncDto): Promise<BlockSync> {
    const createdBlockSync = new this.blockSync(createBlockSyncDto);
    return await createdBlockSync.save();
  }

  /**
   * Get all BlockSync.
   *
   * @returns {BlockSync[]}
   */
  async findAll(): Promise<BlockSync[]> {
    return this.blockSync.find().exec();
  }

  /**
   * Find a single BlockSync by their rpcUrl.
   *
   * @param rpcUrl The BlockSync rpcUrl to filter by.
   * @returns {BlockSync}
   */
  async findOne(rpcUrl: string): Promise<BlockSync | undefined> {
    return this.blockSync.findOne({ rpcUrl: rpcUrl });
  }

  async findByChain(chain: string): Promise<BlockSync[]> {
    return this.blockSync.find({ chain: chain });
  }

  async deleteOne(rpcUrl: string): Promise<void> {
    await this.blockSync.deleteOne({ rpcUrl: rpcUrl });
  }

  async updateLastSync(rpcUrl: string, lastSync: number): Promise<void> {
    await this.blockSync.updateOne({ rpcUrl: rpcUrl }, { lastSync: lastSync });
  }
}
