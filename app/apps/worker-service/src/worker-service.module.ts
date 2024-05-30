import { BlockHistoryModelModule } from '@app/shared_modules/block_history/block_history.module';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ScheduleModule } from '@nestjs/schedule';
import { EthereumWorker } from './worker/ethereum.worker';
import { PolygonWorker } from './worker/polygon.worker';
import { AvaxWorker } from './worker/avax.worker';
import { MantleWorker } from './worker/mantle.worker';
import { BscWorker } from './worker/bsc.worker';
import { DummyController } from './dummy.controller';
import { EthereumWorkerController } from './controllers/ethereum-worker.controller';
import { PolygonWorkerController } from './controllers/polygon-worker.controller';
import { AvaxWorkerController } from './controllers/avax-worker.controller';
import { MantleWorkerController } from './controllers/mantle-worker.controller';
import { BscWorkerController } from './controllers/bsc-worker.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [`${process.env.NODE_ENV}.env`, '.env'],
      expandVariables: true,
    }),
    ClientsModule.register([
      {
        name: 'MONITOR_CLIENT_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'monitor',
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
              restartOnFailure: async (e): Promise<boolean> => {
                console.log('RESTART ON FAILURE worker module');
                console.log(e);
                return true;
              },
            },
          },
          producer: {},
          consumer: {
            groupId: 'monitor-consumer',
          },
        },
      },
    ]),
    ClientsModule.register([
      {
        name: 'WORKER_CLIENT_SERVICE',
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
                console.log('RESTART ON FAILURE worker module');
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
      },
    ]),
    ScheduleModule.forRoot(),
    BlockHistoryModelModule,
  ],
  controllers: [
    process.env.EVM_DISABLE === 'false'
      ? EthereumWorkerController
      : DummyController,
    process.env.POLYGON_DISABLE === 'false'
      ? PolygonWorkerController
      : DummyController,
    process.env.AVAX_DISABLE === 'false'
      ? AvaxWorkerController
      : DummyController,
    process.env.MANTLE_DISABLE === 'false'
      ? MantleWorkerController
      : DummyController,
    process.env.BSC_DISABLE === 'false' ? BscWorkerController : DummyController,
  ],
  providers: [
    EthereumWorker,
    PolygonWorker,
    AvaxWorker,
    MantleWorker,
    BscWorker,
  ],
})
export class WorkerServiceModule {}
