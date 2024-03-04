import { Module } from '@nestjs/common';
import { EthWebhookService } from './eth.webhook.service';
import { DatabaseModule } from 'src/database/database.module';
import { EthWebhookProviders } from './eth.webhook.providers';
import { WalletController } from './eth.webhook.controller';
@Module({
  controllers: [WalletController],
  providers: [EthWebhookService, ...EthWebhookProviders],
  exports: [EthWebhookService],
  imports: [DatabaseModule],
})
export class WalletModule {}
