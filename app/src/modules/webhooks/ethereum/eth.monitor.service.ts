import { Inject, Injectable, Logger } from '@nestjs/common';
import { Model } from 'mongoose';
import { CreateEthMonitorDto } from './dto/eth.create-monitor.dto';
import { EthMonitor } from './schemas/eth.monitor.schema';
import { v4 as uuidv4 } from 'uuid';
import { Log, ethers } from 'ethers';
import { WebhookDeliveryDto } from './dto/eth.webhook-delivery.dto';

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
   * Get all EthWebhook.
   *
   * @returns {EthMonitor[]}
   */
  async findAll(): Promise<EthMonitor[]> {
    return this.ethMonitorModel.find().exec();
  }

  /**
   * Get all EthWebhook.
   *
   * @returns {EthMonitor[]}
   */
  async findAllByAddress(address: string): Promise<EthMonitor[]> {
    return this.ethMonitorModel.find({ address: address }).exec();
  }

  /**
   * Find a single EthWebhook by their address.
   *
   * @param address The EthWebhook address to filter by.
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
      const body = WebhookDeliveryDto.fromLogToERC20(
        event,
        1,
        fromWallet.monitorId,
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
      const body = WebhookDeliveryDto.fromLogToERC20(
        event,
        1,
        toWallet.monitorId,
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

  async sendMessage(wallet: EthMonitor, body: WebhookDeliveryDto) {
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
