import { DatabaseModule } from '@app/database';
import { GlobalModule, GlobalService } from '@app/global';
import { SharedModulesModule } from '@app/shared_modules';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { SwaggerModule } from '@nestjs/swagger';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { WalletModule } from './modules/wallet/wallet.module';
import { PollingBlockService } from './polling.block/polling.block.service';

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
    SharedModulesModule,
    ScheduleModule.forRoot(),
  ],
  providers: [GlobalService, PollingBlockService],
})
export class MainModule {}
