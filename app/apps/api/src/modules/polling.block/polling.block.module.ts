import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ScheduleModule } from '@nestjs/schedule';
import { BlockSyncModelModule } from 'libs';
import { AvaxPollingBlockService } from './avax.polling.block.service';
import { BscPollingBlockService } from './bsc.polling.block.service';
import { EthereumPollingBlockService } from './ethereum.polling.block.service';
import { MantlePollingBlockService } from './mantle.polling.block.service';
import { PolygonPollingBlockService } from './polygon.polling.block.service';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: 'WORKER_CLIENT_SERVICE',
        useFactory: () => ({
          transport: Transport.KAFKA,
          options: {
            client: {
              clientId: 'worker',
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
              retry: {
                restartOnFailure: async (e) => {
                  console.log('RESTART ON FAILURE polling module');
                  console.log(e);
                  return true;
                },
              },
            },
            producer: {},
            consumer: {
              groupId: 'worker-consumer',
            },
          },
        }),
      },
    ]),
    ScheduleModule.forRoot(),
    BlockSyncModelModule,
  ],
  providers: [
    EthereumPollingBlockService,
    PolygonPollingBlockService,
    AvaxPollingBlockService,
    MantlePollingBlockService,
    BscPollingBlockService,
  ],
})
export class PollingBlockModule {}
