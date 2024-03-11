import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { CreateEthWebhookDto } from './dto/eth.create-webhook.dto';
import { EthWebhook } from './schemas/eth.webhook.schema';

@Injectable()
export class EthWebhookService {
  constructor(
    @Inject('ETH_WEBHOOK_MODEL')
    private readonly ethWebhookModel: Model<EthWebhook>,
  ) {}

  async create(
    user: any,
    createEthWebhookDto: CreateEthWebhookDto,
  ): Promise<EthWebhook> {
    const createdEthWebhook = new this.ethWebhookModel(createEthWebhookDto);
    try {
      return await createdEthWebhook.save();
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get all EthWebhook.
   *
   * @returns {EthWebhook[]}
   */
  async findAll(): Promise<EthWebhook[]> {
    return this.ethWebhookModel.find().exec();
  }

  /**
   * Get all EthWebhook.
   *
   * @returns {EthWebhook[]}
   */
  async findAllByAddress(address: string): Promise<EthWebhook[]> {
    return this.ethWebhookModel.find({ address: address }).exec();
  }

  /**
   * Find a single EthWebhook by their address.
   *
   * @param address The EthWebhook address to filter by.
   * @returns {EthWebhook}
   */
  async findOne(address: string): Promise<EthWebhook | undefined> {
    return this.ethWebhookModel.findOne({ address: address });
  }

  async deleteOne(webhookId: string): Promise<void> {
    try {
      await this.ethWebhookModel.deleteOne({ webhookId: webhookId });
    } catch (error) {
      throw error;
    }
  }
}
