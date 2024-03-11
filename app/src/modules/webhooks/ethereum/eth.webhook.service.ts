import { Inject, Injectable, Logger } from '@nestjs/common';
import { Model } from 'mongoose';
import { CreateEthWebhookDto } from './dto/eth.create-webhook.dto';
import { EthWebhook } from './schemas/eth.webhook.schema';
import { v4 as uuidv4 } from 'uuid';
import { Log, ethers } from 'ethers';
import { WebhookDeliveryDto } from './dto/eth.webhook.dto';

@Injectable()
export class EthWebhookService {
  private readonly logger = new Logger(EthWebhookService.name);
  constructor(
    @Inject('ETH_WEBHOOK_MODEL')
    private readonly ethWebhookModel: Model<EthWebhook>,
  ) {}

  async create(
    user: any,
    createEthWebhookDto: CreateEthWebhookDto,
  ): Promise<EthWebhook> {
    const createdEthWebhook = new this.ethWebhookModel({
      ...createEthWebhookDto,
      userId: user.userId,
      webhookId: uuidv4(),
    });
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

  async handleErc20Transfer(event: Log, confirm: boolean) {
    // Extract relevant information from the event
    const contractAddress = ethers.getAddress(event.address).toLowerCase();
    const fromAddress = ethers
      .getAddress(event.topics[1].substring(26))
      .toLowerCase();
    const toAddress = ethers
      .getAddress(event.topics[2].substring(26))
      .toLowerCase();
    const value = ethers.toBigInt(event.data).toString();

    // handle from wallet
    const fromWallet = await this.findOne(fromAddress);
    if (fromWallet) {
      // @todo change webhookDTO to general dto
      const body = new WebhookDeliveryDto(
        event,
        1,
        fromWallet.webhookId,
        'out',
        confirm,
        value,
      );

      // @todo send message to webhook module to deliver for user
      await this.sendMessage(fromWallet, body);

      this.logger.debug(
        'Confirmed:' + confirm + ' ERC20 transfer OUT: ' + JSON.stringify(body),
      );
    }

    // handle to wallet
    const toWallet = await this.findOne(toAddress);
    if (toWallet) {
      // @todo change webhookDTO to general dto
      const body = new WebhookDeliveryDto(
        event,
        1,
        toWallet.webhookId,
        'out',
        confirm,
        value,
      );

      // @todo send message to webhook module to deliver for user
      await this.sendMessage(toWallet, body);

      this.logger.debug(
        'Confirmed:' + confirm + ' ERC20 transfer OUT: ' + JSON.stringify(body),
      );
    }
  }

  async sendMessage(wallet: EthWebhook, body: WebhookDeliveryDto) {
    // @todo handle all notification method
    // @todo handle reesponse fail
    const response = await fetch(wallet.notificationMethods[0].url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
  }
}
