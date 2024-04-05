import { sendDelete, sendGet, sendPost, sendPut } from '@app/utils/http.util';
import { Injectable, Logger } from '@nestjs/common';

export class WebhookServiceDto {
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
  authorization: string;
  updated_at: string;
  url: string;
  valid_status_codes: [];
}

@Injectable()
export class WebhookService {
  private readonly logger = new Logger(WebhookService.name);
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
      authorization: authorization,
      active: true,
      max_delivery_attempts: 5,
      delivery_attempt_timeout: 1,
      retry_min_backoff: 10,
      retry_max_backoff: 60,
    };

    const response = await sendPost(
      `${process.env.WEBHOOK_API_URL}/v1/webhooks`,
      createWebhookDto,
    );

    if (!response.ok) {
      this.logger.error(
        'respone not ok, create webhook failed with name: ' + name,
      );
      throw new Error('create webhook failed');
    }
    if (response.status !== 201) {
      this.logger.error(
        'status code is not 201, create webhook failed with name: ' + name,
      );
      throw new Error('create webhook failed');
    }
    const webhookId = (await response.json()).id;
    this.logger.debug(
      `create webhook success with name: ${name} and id: ${webhookId}`,
    );
    return webhookId;
  }

  async getWebhooks(webhookId: string): Promise<WebhookServiceDto> {
    const response = await sendGet(
      `${process.env.WEBHOOK_API_URL}/v1/webhooks/${webhookId}`,
    );
    if (!response.ok) {
      this.logger.error(
        'respone not ok, get webhook failed with webhookId: ' + webhookId,
      );
      throw new Error('get webhook failed');
    }
    if (response.status !== 200) {
      this.logger.error(
        'status code is not 200, get webhook failed with webhookId: ' +
          webhookId,
      );
      throw new Error('get webhook failed');
    }
    const webhook = await response.json();
    this.logger.debug(`get webhook success with webhookId: ${webhookId}`);
    return webhook as WebhookServiceDto;
  }

  async deleteWebhook(webhookId: string) {
    const response = await sendDelete(
      `${process.env.WEBHOOK_API_URL}/v1/webhooks/${webhookId}`,
    );
    if (!response.ok) {
      this.logger.error(
        'respone not ok, delete webhook failed with response: ' +
          (await response.json()),
      );
      throw new Error('delete webhook failed');
    }
    if (response.status !== 204) {
      this.logger.error(
        'status code is not 204, delete webhook failed with response: ' +
          (await response.json()),
      );
      throw new Error('delete webhook failed');
    }
    this.logger.debug(`delete webhook success with webhookId: ${webhookId}`);
  }

  async updateWebhook(
    webhookId: string,
    webhookUrl: string,
    authorization: string,
    secret_token: string,
  ) {
    const response = await sendPut(
      `${process.env.WEBHOOK_API_URL}/v1/webhooks/${webhookId}`,
      {
        url: webhookUrl,
        authorization: authorization,
        secret_token: secret_token,
      },
    );
    if (!response.ok) {
      this.logger.error(
        'respone not ok, update webhook failed with response: ' +
          (await response.json()),
      );
      throw new Error('update webhook failed');
    }
    if (response.status !== 200) {
      this.logger.error(
        'status code is not 200, update webhook failed with response: ' +
          (await response.json()),
      );
      throw new Error('update webhook failed');
    }
    this.logger.debug(`update webhook success with webhookId: ${webhookId}`);
  }
}
