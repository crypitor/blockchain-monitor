import { EventHistoryModelModule } from '@app/shared_modules/event_history/event_history.module';
import { MonitorModule } from '@app/shared_modules/monitor/monitor.module';
import { ProjectModule } from '@app/shared_modules/project/project.module';
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
              ssl: process.env.KAFKA_SSL === 'true',
              sasl:
                process.env.KAFKA_AUTH_ENABLE === 'true'
                  ? {
                      mechanism: 'plain',
                      username: process.env.KAFKA_USERNAME || '',
                      password: process.env.KAFKA_PASSWORD || '',
                    }
                  : null,
            },
            consumer: {
              groupId: 'webhook-consumer',
            },
            retry: {
              restartOnFailure: async (e) => {
                console.log('RESTART ON FAILURE ethereum module');
                console.log(e);
                return true;
              },
            },
          },
        }),
      },
    ]),
    WebhookModule,
    MonitorModule,
    ProjectModule,
    EventHistoryModelModule,
  ],
})
export class EthereumModule {}
