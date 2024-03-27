import { Module } from '@nestjs/common';
import { WorkerServiceController } from './worker-service.controller';
import { WorkerServiceService } from './worker-service.service';
// import { EthereumWorker } from './worker/evm.worker';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from '@app/database';
import { GlobalModule } from '@app/global';
import { ClientKafka, ClientsModule, Transport } from '@nestjs/microservices';
import { BlockSyncModule } from './blocksync/blocksync.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [`${process.env.NODE_ENV}.env`, '.env'],
      expandVariables: true,
    }),
    ClientsModule.register([
      {
        name: 'MONITOR_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'monitor',
            brokers: process.env.KAFKA_BROKERS.split(','),
          },
          producer: {},
          consumer: {
            groupId: 'monitor-consumer',
          },
        },
      },
    ]),
    DatabaseModule,
    GlobalModule,
    BlockSyncModule,
  ],
  controllers: [WorkerServiceController],
  providers: [
    WorkerServiceService,
    // {
    //   provide: 'KAFKA_PRODUCER',
    //   useFactory: async (kafkaClient: ClientKafka) => {
    //     return kafkaClient.connect();
    //   },
    //   inject: ['MONITOR_SERVICE'],
    // },
  ],
})
export class WorkerServiceModule {}
