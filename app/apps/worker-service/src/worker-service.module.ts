import { BlockHistoryModelModule } from '@app/shared_modules/block_history/block_history.module';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ScheduleModule } from '@nestjs/schedule';
import { WorkerServiceController } from './worker-service.controller';
import { WorkerServiceService } from './worker-service.service';
import { EthereumWorker } from './worker/ethereum.worker';
import { PolygonWorker } from './worker/polygon.worker';

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
    ScheduleModule.forRoot(),
    BlockHistoryModelModule,
  ],
  controllers: [WorkerServiceController],
  providers: [WorkerServiceService, EthereumWorker, PolygonWorker],
})
export class WorkerServiceModule {}
