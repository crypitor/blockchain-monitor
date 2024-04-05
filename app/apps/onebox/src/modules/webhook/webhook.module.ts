import { Module } from '@nestjs/common';
import { WebhookService } from './webhook.service';

@Module({
  providers: [WebhookService],
})
export class WebhookModule {}
