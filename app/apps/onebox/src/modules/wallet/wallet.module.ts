import { Module } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { WalletProviders } from './wallet.providers';
import { WalletController } from './wallet.controller';
import { DatabaseModule } from '@app/database';
@Module({
  controllers: [WalletController],
  providers: [WalletService, ...WalletProviders],
  exports: [WalletService],
  imports: [DatabaseModule],
})
export class WalletModule {}
