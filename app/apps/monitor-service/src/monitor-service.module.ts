import { DatabaseModule } from '@app/database';
import { GlobalModule } from '@app/global';
import { SharedModulesModule } from '@app/shared_modules';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { EthereumModule } from './ethereum/ethereum.module';
import { EthereumService } from './ethereum/ethereum.service';
import { MonitorServiceController } from './monitor-service.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [`${process.env.NODE_ENV}.env`, '.env'],
      expandVariables: true,
    }),
    ClientsModule.register([
      {
        name: 'WEBHOOK_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'webhook-client',
            brokers: process.env.KAFKA_BROKERS.split(','),
          },
          producer: {},
          consumer: {
            groupId: 'webhook-consumer',
          },
        },
      },
    ]),
    DatabaseModule,
    GlobalModule,
    EthereumModule,
    SharedModulesModule,
  ],
  controllers: [MonitorServiceController],
  providers: [EthereumService],
})
export class MonitorServiceModule {}
