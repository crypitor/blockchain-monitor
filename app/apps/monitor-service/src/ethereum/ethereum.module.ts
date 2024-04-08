import { MonitorModule } from '@app/shared_modules/monitor/monitor.module';
import { WebhookModule } from '@app/shared_modules/webhook/webhook.module';
import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { EthereumController } from './ethereum.controller';
import { EthereumService } from './ethereum.service';

@Module({
  providers: [EthereumService],
  controllers: [EthereumController],
  exports: [EthereumService],
  imports: [
    ClientsModule.registerAsync([
      {
        name: 'WEBHOOK_SERVICE',
        useFactory: () => ({
          transport: Transport.KAFKA,
          options: {
            client: {
              clientId: 'webhook',
              brokers: process.env.KAFKA_BROKERS.split(','),
            },
            consumer: {
              groupId: 'webhook-consumer',
            },
          },
        }),
      },
    ]),
    WebhookModule,
    MonitorModule,
  ],
})
export class EthereumModule {}
