import { DatabaseModule } from '@app/database';
import { GlobalModule, GlobalService } from '@app/global';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SwaggerModule } from '@nestjs/swagger';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { WalletModule } from './modules/wallet/wallet.module';
import { EthMonitorModule } from './modules/webhooks/ethereum/eth.monitor.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [`${process.env.NODE_ENV}.env`, '.env'],
      expandVariables: true,
    }),
    DatabaseModule,
    UsersModule,
    AuthModule,
    GlobalModule,
    WalletModule,
    SwaggerModule,
    EthMonitorModule,
  ],
  providers: [GlobalService],
})
export class MainModule {}
