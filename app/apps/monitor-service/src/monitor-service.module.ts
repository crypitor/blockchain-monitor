import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EthereumModule } from './ethereum/ethereum.module';
import { PolygonModule } from './polygon/polygon.module';
import { AvaxModule } from './avax/avax.module';
import { MantleModule } from './mantle/mantle.module';
import { BscModule } from './bsc/bsc.module';
import { DummyModule } from './dummy.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [`${process.env.NODE_ENV}.env`, '.env'],
      expandVariables: true,
    }),
    process.env.EVM_DISABLE === 'false' ? EthereumModule : DummyModule,
    process.env.POLYGON_DISABLE === 'false' ? PolygonModule : DummyModule,
    process.env.AVAX_DISABLE === 'false' ? AvaxModule : DummyModule,
    process.env.MANTLE_DISABLE === 'false' ? MantleModule : DummyModule,
    process.env.BSC_DISABLE === 'false' ? BscModule : DummyModule,
  ],
  controllers: [],
  providers: [],
})
export class MonitorServiceModule {}
