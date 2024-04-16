import { GlobalModule, GlobalService } from '@app/global';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ScheduleModule } from '@nestjs/schedule';
import { SwaggerModule } from '@nestjs/swagger';
import { MonitorAddressModule } from './modules/address/address.module';
import { AuthModule } from './modules/auth/auth.module';
import { BlockSyncModule } from './modules/blocksync/blocksync.module';
import { MonitorModule } from './modules/monitor/monitor.module';
import { ProjectModule } from './modules/project/project.module';
import { UsersModule } from './modules/users/users.module';
import { PollingBlockService } from './polling.block/polling.block.service';
import { DeliveryModule } from './modules/delivery/delivery.module';

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
  ],
  providers: [GlobalService, PollingBlockService],
})
export class MainModule {}
