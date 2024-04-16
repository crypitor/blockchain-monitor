import { sendDelete, sendGet, sendPost, sendPut } from '@app/utils/http.util';
import { Injectable, Logger } from '@nestjs/common';
import { WebhookDeliveryDto } from 'apps/monitor-service/src/ethereum/dto/eth.webhook-delivery.dto';

@Injectable()
export class WebhookService {
  private readonly logger = new Logger(WebhookService.name);
  webhookUrl: string;

  onModuleInit() {
    this.webhookUrl = process.env.WEBHOOK_API_URL;
  }
  /**
   * Create webhook for monitor
   * curl --location --request POST 'http://localhost:8000/v1/webhooks' \
      --header 'Content-Type: application/json' \
      --data-raw '{
        "name": "Http post",
        "url": "https://webhook.site/c98ef6a1-a38b-4d63-91f3-8c150a376a4e",
        "content_type": "application/json",
        "valid_status_codes": [
            200,
            201
        ],
        "secret_token": "my-secret-token", // this token use for sha256 hmac sign to payload
        "authorization_token": "my-authorization-token",
        "active": true,
        "max_delivery_attempts": 5,
        "delivery_attempt_timeout": 1,
        "retry_min_backoff": 10,
        "retry_max_backoff": 60
    }'
   */
  async createWebhook(
    name: string,
    webhookUrl: string,
    secret_token: string,
    authorization: string,
  ): Promise<string> {
    const createWebhookDto = {
      name: name,
      url: webhookUrl,
      content_type: 'application/json',
      valid_status_codes: [200, 201],
      secret_token: secret_token,
      authorization_token: authorization,
      active: true,
      max_delivery_attempts: 5,
      delivery_attempt_timeout: 1,
      retry_min_backoff: 10,
      retry_max_backoff: 60,
    };
    try {
      console.log(createWebhookDto);
      const response = await sendPost(
        `${this.webhookUrl}/v1/webhooks`,
        createWebhookDto,
      );

      if (!response.ok) {
        this.logger.error(
          `respone not ok, create webhook failed with response: ${await response.text()}`,
        );
        throw new Error('create webhook failed');
      }
      const webhookId = (await response.json()).id;
      this.logger.debug(
        `create webhook success with name: ${name} and id: ${webhookId}`,
      );
      return webhookId;
    } catch (e) {
      this.logger.error(
        'error connection with webhook service, create webhook failed with name: ' +
          name,
      );
      throw new Error('create webhook failed');
    }
  }

  async getWebhooks(webhookId: string): Promise<WebhookServiceResponseDto> {
    const response = await sendGet(
      `${this.webhookUrl}/v1/webhooks/${webhookId}`,
    );
    if (!response.ok) {
      const body = await response.json();
      this.logger.error(
        'respone not ok, get webhook failed with response: ' +
          JSON.stringify(body),
      );
      throw new Error('get webhook failed');
    }
    const webhook = await response.json();
    this.logger.debug(`get webhook success with webhookId: ${webhookId}`);
    return webhook as WebhookServiceResponseDto;
  }

  async deleteWebhook(webhookId: string) {
    try {
      const response = await sendDelete(
        `${this.webhookUrl}/v1/webhooks/${webhookId}`,
      );
      if (!response.ok) {
        const body = await response.json();
        this.logger.error(
          'respone not ok, delete webhook failed with response: ' +
            JSON.stringify(body),
        );
        throw new Error('delete webhook failed');
      }
      this.logger.debug(`delete webhook success with webhookId: ${webhookId}`);
    } catch (e) {
      this.logger.error(
        'error connection with webhook service, delete webhook failed with webhookId: ' +
          webhookId,
      );
      throw new Error('delete webhook failed');
    }
  }

  async updateWebhook(
    webhookId: string,
    webhookUrl?: string,
    authorization?: string,
    secret_token?: string,
    active?: boolean,
  ) {
    try {
      const request = this.buildUpdateWebhookRequest(
        webhookUrl,
        authorization,
        secret_token,
        active,
      );
      const response = await sendPut(
        `${this.webhookUrl}/v1/webhooks/${webhookId}`,
        request,
      );
      if (!response.ok) {
        this.logger.error(
          `respone not ok, update webhook failed with response: ${await response.text()}`,
        );
        throw new Error('update webhook failed');
      }
      this.logger.debug(`update webhook success with webhookId: ${webhookId}`);
    } catch (e) {
      this.logger.error(
        'error connection with webhook service, update webhook failed with webhookId: ' +
          webhookId,
      );
      throw new Error('update webhook failed');
    }
  }

  // dispatch message
  /**
   * 
   curl --location --request POST 'http://localhost:8000/v1/deliveries' \
    --header 'Content-Type: application/json' \
    --data-raw '{
        "webhook_id": "b8c4a293-6136-4e80-b921-6fe509514730",
        "payload": {"id":"wh_iwaEYSBXqelwN3Z1","chain":"ETH","monitorId":"mo_yHjz9eW6bp4c9kTy","hash":"0xf4258ab6f2e40dbe2e3fd3194bf396f5494a7dd471e4a3a32adc1dffbfb0dd63","blockNum":1189165,"fromAddress":"0xcc9efe8992b02eaea81a9129242a05ebcb006931","toAddress":"0xcc9efe8992b02eaea81a9129242a05ebcb006931","tokenId":"0","tokenValue":"0","nativeAmount":"100000000000000000","type":"out","confirm":true,"category":"Native","tags":["string"]}
    }'
   */
  async dispatchMessage(
    webhookId: string,
    body: WebhookDeliveryDto,
  ): Promise<DispatchWebhookResponse> {
    try {
      const response = await sendPost(`${this.webhookUrl}/v1/deliveries`, {
        webhook_id: webhookId,
        payload: body.toString(),
      });
      if (!response.ok) {
        this.logger.error(
          `respone not ok, send webhook failed with response: ${await response.text()}`,
        );
        throw new Error('send webhook failed');
      }
      this.logger.debug(`send webhook success with webhookId: ${webhookId}`);
      return (await response.json()) as DispatchWebhookResponse;
    } catch (e) {
      this.logger.error(
        'error connection with webhook service, send webhook failed with webhookId: ' +
          webhookId,
      );
      throw new Error('send webhook failed');
    }
  }

  /**
   * curl --location --request GET 'http://localhost:8000/v1/deliveries?webhook_id=a6e9a525-ac5a-488c-b118-bd7327ce6d8d'
   */
  async getDeliveries(
    webhookId: string,
    limit?: number,
    offset?: number,
    status?: 'succeeded' | 'pending' | 'failed',
  ): Promise<DeliveriesResponseDto> {
    try {
      const url = this.buildDeliveryUrl(webhookId, limit, offset, status);
      const response = await sendGet(url);
      if (!response.ok) {
        this.logger.error(
          `respone not ok, get deliveries with response: ${await response.text()}`,
        );
        throw new Error('get deliveries');
      }
      this.logger.debug(`send webhook success with webhookId: ${webhookId}`);
      return (await response.json()) as DeliveriesResponseDto;
    } catch (e) {
      this.logger.error(
        'error connection with webhook service, get deliveries with webhookId: ' +
          webhookId,
      );
      throw new Error('get deliveries');
    }
  }

  /**
   * curl "http://localhost:8000/v1/delivery-attempts?delivery_id=22bff8ff-64e7-4117-af04-f43401802a82"
   * @param deliveryId string
   */
  async getDeliveryAttempts(
    deliveryId: string,
  ): Promise<DeliveryAttemptsResponseDto> {
    try {
      const url = this.buildDeliveryAttemptsUrl(deliveryId);
      const response = await sendGet(url);
      if (!response.ok) {
        this.logger.error(
          `respone not ok, get deliveries with response: ${await response.text()}`,
        );
        throw new Error('get deliveries Attempts');
      }
      this.logger.debug(`send webhook success with deliveryId: ${deliveryId}`);
      return (await response.json()) as DeliveryAttemptsResponseDto;
    } catch (e) {
      this.logger.error(
        'error connection with webhook service, get deliveries with deliveryId: ' +
          deliveryId,
      );
      throw new Error('get deliveries attempts');
    }
  }

  private buildDeliveryUrl(
    webhookId: string,
    limit?: number,
    offset?: number,
    status?: 'succeeded' | 'pending' | 'failed',
  ): string {
    let url = `${this.webhookUrl}/v1/deliveries?webhook_id=${webhookId}`;

    if (limit !== undefined) {
      url += `&limit=${limit}`;
    }

    if (offset !== undefined) {
      url += `&offset=${offset}`;
    }

    if (status !== undefined) {
      url += `&status=${status}`;
    }

    return url;
  }

  private buildDeliveryAttemptsUrl(deliveryId: string): string {
    return `${this.webhookUrl}/v1/delivery-attempts?delivery_id=${deliveryId}`;
  }

  private buildUpdateWebhookRequest(
    webhookUrl?: string,
    authorization?: string,
    secret_token?: string,
    active?: boolean,
  ): UpdateWebhookRequestDto {
    const options: UpdateWebhookRequestDto = {};

    // Check each input and add it to the options object only if it's defined
    if (webhookUrl !== undefined) {
      options.url = webhookUrl;
    }

    if (authorization !== undefined) {
      options.authorization_token = authorization;
    }

    if (secret_token !== undefined) {
      options.secret_token = secret_token;
    }

    if (active !== undefined) {
      options.active = active;
    }

    return options;
  }
}

export class WebhookServiceResponseDto {
  active: true;
  content_type: string;
  created_at: string;
  delivery_attempt_timeout: 0;
  id: string;
  max_delivery_attempts: 0;
  name: string;
  retry_max_backoff: 0;
  retry_min_backoff: 0;
  secret_token: string;
  authorization_token: string;
  updated_at: string;
  url: string;
  valid_status_codes: [];
}

interface DispatchWebhookResponse {
  id: string;
  webhook_id: string;
  payload: string;
  scheduled_at: string;
  delivery_attempts: number;
  status: string;
  created_at: string;
  updated_at: string;
}

export class DeliveryDto {
  created_at: string;
  delivery_attempts: number;
  id: string;
  payload: string;
  scheduled_at: string;
  status: string;
  updated_at: string;
  // webhook_id: string;
}

export class DeliveriesResponseDto {
  deliveries: DeliveryDto[];
  limit: number;
  offset: number;
}

class UpdateWebhookRequestDto {
  url?: string;
  authorization_token?: string;
  secret_token?: string;
  active?: boolean;
}

export class DeliveryAttemptDto {
  id: string;
  // webhook_id: string;
  delivery_id: string;
  raw_request: string;
  raw_response: string;
  response_status_code: number;
  execution_duration: number;
  success: boolean;
  error: string;
  created_at: string;
}

export class DeliveryAttemptsResponseDto {
  delivery_attempts: DeliveryAttemptDto[];
  limit: number;
  offset: number;
}
