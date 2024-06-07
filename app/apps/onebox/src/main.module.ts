import { GlobalModule, GlobalService } from '@app/global';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ScheduleModule } from '@nestjs/schedule';
import { SwaggerModule } from '@nestjs/swagger';
import { BlockSyncModelModule } from 'libs';
import { MonitorAddressModule } from './modules/address/address.module';
import { ApiV1Module } from './modules/api/v1/apiv1.module';
import { ApiKeyModule } from './modules/apikey/apikey.module';
import { AuthModule } from './modules/auth/auth.module';
import { DeliveryModule } from './modules/delivery/delivery.module';
import { EventHistoryModule } from './modules/event_history/event_history.module';
import { MonitorModule } from './modules/monitor/monitor.module';
import { ProjectModule } from './modules/project/project.module';
import { QuickStartModule } from './modules/quickstart/quickstart.module';
import { UsersModule } from './modules/users/users.module';
import { AvaxPollingBlockService } from './polling.block/avax.polling.block.service';
import { BscPollingBlockService } from './polling.block/bsc.polling.block.service';
import { EthereumPollingBlockService } from './polling.block/ethereum.polling.block.service';
import { MantlePollingBlockService } from './polling.block/mantle.polling.block.service';
import { PolygonPollingBlockService } from './polling.block/polygon.polling.block.service';
import { BlockSyncModule } from './modules/blocksync/blocksync.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [`${process.env.NODE_ENV}.env`, '.env'],
      expandVariables: true,
    }),
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
                console.log('RESTART ON FAILURE onebox module');
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
    UsersModule,
    AuthModule,
    GlobalModule,
    SwaggerModule,
    ScheduleModule.forRoot(),
    ProjectModule,
    BlockSyncModule,
    MonitorModule,
    MonitorAddressModule,
    DeliveryModule,
    EventHistoryModule,
    QuickStartModule,
    ApiKeyModule,
    ApiV1Module,
  ],
  providers: [
    GlobalService,
    EthereumPollingBlockService,
    PolygonPollingBlockService,
    AvaxPollingBlockService,
    MantlePollingBlockService,
    BscPollingBlockService,
  ],
})
export class MainModule {}
