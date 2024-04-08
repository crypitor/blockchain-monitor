import { Module } from '@nestjs/common';
import { WebhookService } from './webhook.service';

@Module({
  imports: [],
  exports: [WebhookService],
  providers: [WebhookService],
})
export class WebhookModule {}
