import { DatabaseModule } from '@app/database';
import { GlobalModule, GlobalService } from '@app/global';
import { SharedModulesModule } from '@app/shared_modules';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { SwaggerModule } from '@nestjs/swagger';
import { AuthModule } from './modules/auth/auth.module';
import { ProjectModule } from './modules/project/project.module';
import { UsersModule } from './modules/users/users.module';
import { WalletModule } from './modules/wallet/wallet.module';
import { PollingBlockService } from './polling.block/polling.block.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
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
  ],
  providers: [GlobalService, PollingBlockService],
})
export class MainModule {}
