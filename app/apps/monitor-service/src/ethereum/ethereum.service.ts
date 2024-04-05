import { EthMonitorAddressRepository } from '@app/shared_modules/monitor/repositories/monitor.address.repository';
import { MonitorRepository } from '@app/shared_modules/monitor/repositories/monitor.repository';
import { MonitorAddress } from '@app/shared_modules/monitor/schemas/monitor.address.schema';
import {
  Monitor,
  MonitoringType,
  WebhookNotification,
} from '@app/shared_modules/monitor/schemas/monitor.schema';
import { chainName } from '@app/utils/chainNameUtils';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { ethers, Log, TransactionResponse } from 'ethers';
import {
  WebhookDeliveryDto,
  WebhookType,
} from './dto/eth.webhook-delivery.dto';
import { ClientKafka } from '@nestjs/microservices';

@Injectable()
export class EthereumService {
  private readonly logger = new Logger(EthereumService.name);

  @Inject()
  private readonly ethMonitorAddressRepository: EthMonitorAddressRepository;

  @Inject()
  private readonly monitorRepository: MonitorRepository;

  @Inject('WEBHOOK_SERVICE')
  private readonly webhookClient: ClientKafka;

  async findEthAddress(address: string): Promise<MonitorAddress[]> {
    return this.ethMonitorAddressRepository.findByAddress(address);
  }

  async findMonitor(monitorId: string): Promise<Monitor> {
    return this.monitorRepository.findById(monitorId);
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
    const fromWallet_monitors = await this.findEthAddress(fromAddress);
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
    const toWallet_monitors = await this.findEthAddress(toAddress);
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

    const fromAddress = ethers.getAddress(event.topics[1].substring(26));
    const toAddress = ethers.getAddress(event.topics[2].substring(26));
    const tokenId = ethers.toBigInt(event.topics[3]).toString();

    // handle from wallet
    const fromWallet_monitors = await this.findEthAddress(fromAddress);
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
    const toWallet_monitors = await this.findEthAddress(toAddress);
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

    const fromWallet_monitors = await this.findEthAddress(
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

    const toWallet_monitors = await this.findEthAddress(
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
    addresses: MonitorAddress[],
    confirm: boolean,
    transaction: TransactionResponse,
    type: WebhookType,
  ) {
    // @todo check condition of monitor and event log if it match
    for (const address of addresses) {
      const monitor = await this.findMonitor(address.monitorId);
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
    addresses: MonitorAddress[],
    confirm: boolean,
    event: Log,
    tokenId: string,
    type: WebhookType,
  ) {
    // @todo check condition of monitor and event log if it match
    for (const address of addresses) {
      const monitor = await this.findMonitor(address.monitorId);
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
    addresses: MonitorAddress[],
    confirm: boolean,
    event: Log,
    value: string,
    type: WebhookType,
  ) {
    // @todo check condition of monitor and event log if it match
    for (const address of addresses) {
      const monitor = await this.findMonitor(address.monitorId);
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

  private async sendMessage(monitor: Monitor, body: WebhookDeliveryDto) {
    if (!monitor.notification) {
      return;
    }
    const webhook = monitor.notification as WebhookNotification;
    try {
      const response = await fetch(webhook.url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: webhook.authorization,
        },
        body: JSON.stringify(body),
      });
      if (!response.ok) {
        this.logger.error(
          `Error while sending webhook request to: ${webhook.url}`,
          response,
        );
      }
    } catch (error) {
      this.logger.error(
        `Error while sending webhook request to: ${webhook.url}`,
        error,
      );
    }
  }

  private async sendToWebhook(monitor: Monitor, body: WebhookDeliveryDto) {
    // every monitor has a webhook id in webhook-service
    // we need to send body payload to webhook service
    // curl --location --request POST 'http://localhost:8000/v1/deliveries' \
    //   --header 'Content-Type: application/json' \
    //   --data-raw '{
    //       "webhook_id": "3b81e80e-3c4d-470d-be1f-e692c69d0b9d",
    //       "payload": "{\"success2\": true}"
    //   }'
    this.webhookClient.emit('webhook-event', {
      webhook_id: monitor.webhookId,
      payload: body,
    });
  }
}
