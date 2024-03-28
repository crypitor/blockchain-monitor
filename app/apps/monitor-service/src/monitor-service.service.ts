import {
  EthMonitor,
  MonitoringType,
} from '@app/shared_modules/eth.monitor/schemas/eth.monitor.schema';
import { chainName } from '@app/utils/chainNameUtils';
import { Inject, Injectable, Logger } from '@nestjs/common';
import {
  WebhookDeliveryDto,
  WebhookType,
} from 'apps/onebox/src/modules/webhooks/ethereum/dto/eth.webhook-delivery.dto';
import { ethers, Log, TransactionResponse } from 'ethers';
import { Model } from 'mongoose';

@Injectable()
export class MonitorServiceService {
  private readonly logger = new Logger(MonitorServiceService.name);

  @Inject('ETH_MONITOR_MODEL')
  private readonly ethMonitorModel: Model<EthMonitor>;

  getHello(value: any): string {
    console.log(value);
    return 'Hello World!';
  }

  async findAllByAddress(address: string): Promise<EthMonitor[]> {
    return this.ethMonitorModel.find({ address: address }).exec();
  }

  async handleErc20Transfer(data: any): Promise<void> {
    const event = data.event as Log;
    const confirm = data.confirm as boolean;
    // Extract relevant information from the event
    // const contractAddress = ethers.getAddress(event.address).toLowerCase();
    const fromAddress = ethers
      .getAddress(event.topics[1].substring(26))
      .toLowerCase();
    const toAddress = ethers
      .getAddress(event.topics[2].substring(26))
      .toLowerCase();
    const value = ethers.toBigInt(event.data).toString();

    // handle from wallet
    const fromWallet_monitors = await this.findAllByAddress(fromAddress);
    if (fromWallet_monitors) {
      this.handleMatchConditionERC20(
        fromWallet_monitors,
        confirm,
        event,
        value,
        WebhookType.out,
      );
    }

    // handle to wallet
    const toWallet_monitors = await this.findAllByAddress(toAddress);
    if (toWallet_monitors) {
      this.handleMatchConditionERC20(
        toWallet_monitors,
        confirm,
        event,
        value,
        WebhookType.in,
      );
    }
  }

  async handleErc721Transfer(data: any) {
    const event = data.event as Log;
    const confirm = data.confirm as boolean;
    // Extract relevant information from the event
    // const contractAddress = ethers.getAddress(event.address).toLowerCase();

    // @note can remove toLowerCase here because topic already lower case
    const fromAddress = ethers
      .getAddress(event.topics[1].substring(26))
      .toLowerCase();
    const toAddress = ethers
      .getAddress(event.topics[2].substring(26))
      .toLowerCase();
    const tokenId = ethers.toBigInt(event.topics[3]).toString();

    // handle from wallet
    const fromWallet_monitors = await this.findAllByAddress(fromAddress);
    if (fromWallet_monitors) {
      this.handleMatchConditionERC721(
        fromWallet_monitors,
        confirm,
        event,
        tokenId,
        WebhookType.out,
      );
    }

    // handle to wallet
    const toWallet_monitors = await this.findAllByAddress(toAddress);
    if (toWallet_monitors) {
      this.handleMatchConditionERC721(
        toWallet_monitors,
        confirm,
        event,
        tokenId,
        WebhookType.in,
      );
    }
  }

  async handleNativeTransfer(data: any): Promise<void> {
    const transaction = data.transaction as TransactionResponse;
    const confirm = data.confirm as boolean;

    const fromWallet_monitors = await this.findAllByAddress(
      ethers.getAddress(transaction.from).toLowerCase(),
    );
    if (fromWallet_monitors) {
      this.handleMatchConditionNative(
        fromWallet_monitors,
        confirm,
        transaction,
        WebhookType.out,
      );
    }

    const toWallet_monitors = await this.findAllByAddress(
      ethers.getAddress(transaction.to).toLowerCase(),
    );
    if (toWallet_monitors) {
      this.handleMatchConditionNative(
        toWallet_monitors,
        confirm,
        transaction,
        WebhookType.in,
      );
    }
  }

  private async handleMatchConditionNative(
    monitors: EthMonitor[],
    confirm: boolean,
    transaction: TransactionResponse,
    type: WebhookType,
  ) {
    // @todo check condition of monitor and event log if it match
    for (const monitor of monitors) {
      if (!monitor.condition.native) {
        continue;
      }
      if (
        monitor.type !== MonitoringType.ALL &&
        monitor.type.toString() !== type.toString()
      ) {
        continue;
      }

      const body = WebhookDeliveryDto.fromTransactionToNative(
        transaction,
        chainName.ETH,
        monitor.monitorId,
        type,
        confirm,
      );

      await this.sendMessage(monitor, body);

      this.logger.debug(
        `Confirmed: ${confirm} native transfer:\n${JSON.stringify(body)}`,
      );
    }
  }

  private async handleMatchConditionERC721(
    monitors: EthMonitor[],
    confirm: boolean,
    event: Log,
    tokenId: string,
    type: WebhookType,
  ) {
    // @todo check condition of monitor and event log if it match
    for (const monitor of monitors) {
      // ignore monitor condition on erc721
      if (!monitor.condition.erc721) {
        continue;
      }
      if (
        monitor.type !== MonitoringType.ALL &&
        monitor.type.toString() !== type.toString()
      ) {
        continue;
      }
      // @todo check condition on specific cryptos
      const body = WebhookDeliveryDto.fromLogToERC721(
        event,
        chainName.ETH,
        monitor.monitorId,
        type,
        confirm,
        tokenId,
      );

      await this.sendMessage(monitor, body);

      this.logger.debug(
        `Confirmed: ${confirm} ERC721 transfer ${type.toUpperCase()}:\n${JSON.stringify(
          body,
        )}`,
      );
    }
  }

  private async handleMatchConditionERC20(
    monitors: EthMonitor[],
    confirm: boolean,
    event: Log,
    value: string,
    type: WebhookType,
  ) {
    // @todo check condition of monitor and event log if it match
    for (const monitor of monitors) {
      // ignore monitor condition on erc20
      if (!monitor.condition.erc20) {
        continue;
      }
      if (
        monitor.type !== MonitoringType.ALL &&
        monitor.type.toString() !== type.toString()
      ) {
        continue;
      }
      // @todo check condition on specific cryptos
      const body = WebhookDeliveryDto.fromLogToERC20(
        event,
        chainName.ETH,
        monitor.monitorId,
        type,
        confirm,
        value,
      );

      await this.sendMessage(monitor, body);

      this.logger.debug(
        `Confirmed: ${confirm} ERC20 transfer ${type.toUpperCase()}:\n${JSON.stringify(
          body,
        )}`,
      );
    }
  }

  private async sendMessage(wallet: EthMonitor, body: WebhookDeliveryDto) {
    // @todo handle calling failed and retry for user
    // @todo check user plan and quota for sending webhooks
    for (const notificationMethod of wallet.notificationMethods) {
      try {
        const response = await fetch(notificationMethod.url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(body),
        });
        if (!response.ok) {
          this.logger.error(
            `Error while sending webhook request to: ${notificationMethod.url}`,
            response,
          );
        }
      } catch (error) {
        this.logger.error(
          `Error while sending webhook request to: ${notificationMethod.url}`,
          error,
        );
      }
    }
  }
}
