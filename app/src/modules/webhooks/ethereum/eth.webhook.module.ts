import { Module } from '@nestjs/common';
import { EthWebhookService } from './eth.webhook.service';
import { DatabaseModule } from 'src/database/database.module';
import { EthWebhookProviders } from './eth.webhook.providers';
import { EthWebhookController } from './eth.webhook.controller';
@Module({
  controllers: [EthWebhookController],
  providers: [EthWebhookService, ...EthWebhookProviders],
  exports: [EthWebhookService],
  imports: [DatabaseModule],
})
export class EthWebhookModule {}
