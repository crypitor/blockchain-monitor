import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { CreateWalletWebhookDto } from './dto/create-wallet.dto';
import { Wallet } from './schemas/wallet.schema';

@Injectable()
export class WalletService {
  constructor(
    @Inject('WALLET_MODEL') private readonly walletModel: Model<Wallet>,
  ) {}

  async create(createWalletDto: CreateWalletWebhookDto): Promise<Wallet> {
    const createdWallet = new this.walletModel(createWalletDto);
    try {
      return await createdWallet.save();
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get all Wallet.
   *
   * @returns {Wallet[]}
   */
  async findAll(): Promise<Wallet[]> {
    return this.walletModel.find().exec();
  }

  /**
   * Find a single Wallet by their address.
   *
   * @param address The Wallet address to filter by.
   * @returns {Wallet}
   */
  async findOne(address: string): Promise<Wallet | undefined> {
    return this.walletModel.findOne({ address: address });
  }

  async deleteOne(address: string): Promise<void> {
    try {
      await this.walletModel.deleteOne({ address: address });
    } catch (error) {
      throw error;
    }
  }
}
