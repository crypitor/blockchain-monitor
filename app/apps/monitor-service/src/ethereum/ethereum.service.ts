import { EthEventHistoryRepository } from '@app/shared_modules/event_history/repositories/event_history.repository';
import {
  EventHistory,
  WebhookType,
} from '@app/shared_modules/event_history/schemas/event_history.schema';
import { EthMonitorAddressRepository } from '@app/shared_modules/monitor/repositories/monitor.address.repository';
import { MonitorRepository } from '@app/shared_modules/monitor/repositories/monitor.repository';
import { MonitorAddress } from '@app/shared_modules/monitor/schemas/monitor.address.schema';
import {
  Monitor,
  MonitoringType,
  WebhookNotification,
} from '@app/shared_modules/monitor/schemas/monitor.schema';
import { ProjectQuotaService } from '@app/shared_modules/project/services/project.quota.service';
import {
  DispatchWebhookResponse,
  WebhookService,
} from '@app/shared_modules/webhook/webhook.service';
import { SupportedChain } from '@app/utils/supportedChain.util';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { ethers, Log, TransactionResponse } from 'ethers';

@Injectable()
export class EthereumService {
  private readonly logger = new Logger(EthereumService.name);

  @Inject()
  private readonly ethMonitorAddressRepository: EthMonitorAddressRepository;

  @Inject()
  private readonly monitorRepository: MonitorRepository;

  @Inject('WEBHOOK_SERVICE')
  private readonly webhookClient: ClientKafka;

  @Inject()
  private readonly webhookService: WebhookService;

  @Inject()
  private readonly projectQuotaService: ProjectQuotaService;

  @Inject()
  private readonly eventHistoryRepository: EthEventHistoryRepository;

  async findEthAddress(address: string): Promise<MonitorAddress[]> {
    return this.ethMonitorAddressRepository.findByAddress(address);
  }

  async findMonitor(monitorId: string): Promise<Monitor> {
    return this.monitorRepository.findById(monitorId);
  }

  async handleErc20Transfer(data: any): Promise<void> {
    const event = data.event as Log;
    const confirm = data.confirm as boolean;
    this.logger.debug([
      'ERC20',
      `received transaction ${event.transactionHash} from block ${event.blockNumber}`,
    ]);
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

    this.logger.debug([
      'ERC721',
      `received transaction ${event.transactionHash} from block ${event.blockNumber}`,
    ]);

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

    this.logger.debug([
      'NATIVE',
      `receive new transaction ${transaction.hash} from block ${transaction.blockNumber}`,
    ]);

    // return if value is zero
    if (transaction.value == 0n) {
      return;
    }

    const fromWallet_monitors = await this.findEthAddress(
      transaction.from.toLowerCase(),
    );
    if (fromWallet_monitors) {
      this.handleMatchConditionNative(
        fromWallet_monitors,
        confirm,
        transaction,
        WebhookType.out,
      );
    }
    // return on to address is null. this is transaction create contract
    if (!transaction.to) {
      return;
    }
    const toWallet_monitors = await this.findEthAddress(
      transaction.to.toLowerCase(),
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

      const txnHistory = EventHistory.fromTransactionToNative(
        transaction,
        SupportedChain.ETH.name,
        monitor.monitorId,
        type,
        confirm,
      );

      const response = await this.dispatchMessageToWebhook(monitor, txnHistory);
      this.saveHistory(txnHistory, response);

      this.logger.debug(
        `Confirmed: ${confirm} native transfer:\n${JSON.stringify(txnHistory)}`,
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
      const transaction = EventHistory.fromLogToERC721(
        event,
        SupportedChain.ETH.name,
        monitor.monitorId,
        type,
        confirm,
        tokenId,
      );

      const response = await this.dispatchMessageToWebhook(monitor, transaction);
      this.saveHistory(transaction, response);

      this.logger.debug(
        `Confirmed: ${confirm} ERC721 transfer ${type.toUpperCase()}:\n${JSON.stringify(
          transaction,
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
      const txnHistory = EventHistory.fromLogToERC20(
        event,
        SupportedChain.ETH.name,
        monitor.monitorId,
        type,
        confirm,
        value,
      );

      const response = await this.dispatchMessageToWebhook(monitor, txnHistory);
      this.saveHistory(txnHistory, response);

      this.logger.debug(
        `Confirmed: ${confirm} ERC20 transfer ${type.toUpperCase()}:\n${JSON.stringify(
          txnHistory,
        )}`,
      );
    }
  }

  private async saveHistory(
    transaction: EventHistory,
    delivery: DispatchWebhookResponse,
  ) {
    // @todo handle when dispatch message to webhook service
    if (!transaction.confirm) {
      transaction.deliveryIds = [delivery.id];
      await this.eventHistoryRepository.saveEventHistory(transaction);
    } else {
      this.eventHistoryRepository.pushDeliveryId(
        transaction.eventId,
        delivery.id,
      );
    }
  }

  private async sendMessage(monitor: Monitor, body: EventHistory) {
    if (!monitor.notification) {
      return;
    }
    const webhook = monitor.notification as WebhookNotification;
    body.tags = monitor.tags;
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

  private async dispatchMessageToWebhook(
    monitor: Monitor,
    body: EventHistory,
  ): Promise<DispatchWebhookResponse> {
    if (!monitor.notification) {
      return;
    }
    const webhook = monitor.notification as WebhookNotification;
    body.tags = monitor.tags;
    try {
      const respone = await this.webhookService.dispatchMessage(
        monitor.webhookId,
        body,
      );
      this.logger.debug(
        `Dispatch webhook successfully response: ${JSON.stringify(respone)}`,
      );
      this.projectQuotaService.increaseUsed(monitor.projectId);
      return respone;
    } catch (error) {
      this.logger.error(
        `Error while sending webhook request to: ${webhook.url}`,
        error,
      );
    }
  }
}
