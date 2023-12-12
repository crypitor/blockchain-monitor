import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { CreateBlockSyncDto } from './dto/create-blocksync.dto';
import { BlockSync } from './schemas/blocksync.schema';

@Injectable()
export class BlockSyncService {
  constructor(@Inject('BLOCKSYNC_MODEL') private readonly blockSync: Model<BlockSync>) {}

  async create(createBlockSyncDto: CreateBlockSyncDto): Promise<BlockSync> {
    const createdBlockSync = new this.blockSync(createBlockSyncDto);
    try {
      return await createdBlockSync.save();
    } catch (error) {
      throw error;
    }
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

  async deleteOne(rpcUrl: string): Promise<void> {
    try {
      await this.blockSync.deleteOne({ rpcUrl: rpcUrl });
    } catch (error) {
      throw error;
    }
  }

  async updateLastSync(rpcUrl: string, lastSync: number): Promise<void> {
    try {
      await this.blockSync.updateOne({ rpcUrl: rpcUrl }, { lastSync: lastSync });
    } catch (error) {
      throw error;
    }
  }
}
