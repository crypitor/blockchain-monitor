import { DatabaseModule } from '@app/database';
import { GlobalModule, GlobalService } from '@app/global';
import { SharedModulesModule } from '@app/shared_modules';
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
import { WalletModule } from './modules/wallet/wallet.module';
import { WebhookModule } from './modules/webhook/webhook.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [`${process.env.NODE_ENV}.env`, '.env'],
      expandVariables: true,
    }),
    ClientsModule.register([
      {
        name: 'POLLING_BLOCK_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'polling-block-client',
            brokers: process.env.KAFKA_BROKERS.split(','),
          },
          producer: {},
          consumer: {
            groupId: 'polling-block-consumer',
          },
        },
      },
    ]),
    DatabaseModule,
    UsersModule,
    AuthModule,
    GlobalModule,
    WalletModule,
    SwaggerModule,
    SharedModulesModule,
    ScheduleModule.forRoot(),
    ProjectModule,
    BlockSyncModule,
    MonitorModule,
    MonitorAddressModule,
    WebhookModule,
  ],
  providers: [GlobalService],
})
export class MainModule {}
