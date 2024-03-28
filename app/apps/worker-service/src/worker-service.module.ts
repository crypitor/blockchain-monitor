import { DatabaseModule } from '@app/database';
import { GlobalModule } from '@app/global';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ScheduleModule } from '@nestjs/schedule';
import { BlockSyncModule } from './blocksync/blocksync.module';
import { WorkerServiceController } from './worker-service.controller';
import { WorkerServiceService } from './worker-service.service';
import { EthereumWorker } from './worker/evm.worker';

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
    ScheduleModule.forRoot(),
  ],
  controllers: [WorkerServiceController],
  providers: [WorkerServiceService, EthereumWorker],
})
export class WorkerServiceModule {}
