import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SwaggerModule } from '@nestjs/swagger';
import { DatabaseModule } from 'src/database/database.module';
import { GlobalModule } from 'src/global/global.module';
import { GlobalService } from 'src/global/global.service';
import { AuthModule } from 'src/modules/auth/auth.module';
import { UsersModule } from 'src/modules/users/users.module';
import { WalletModule } from 'src/modules/wallet/wallet.module';
import { EthMonitorModule } from 'src/modules/webhooks/ethereum/eth.monitor.module';

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
export class WebhookModule {}
