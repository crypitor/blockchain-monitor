import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EthereumModule } from './ethereum/ethereum.module';
import { PolygonModule } from './polygon/polygon.module';
import { AvaxModule } from './avax/avax.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [`${process.env.NODE_ENV}.env`, '.env'],
      expandVariables: true,
    }),
    EthereumModule,
    PolygonModule,
    AvaxModule,
  ],
  controllers: [],
  providers: [],
})
export class MonitorServiceModule {}
