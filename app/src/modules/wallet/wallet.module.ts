import { Module } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { DatabaseModule } from 'src/database/database.module';
import { WalletProviders } from './wallet.providers';
import { WalletController } from './wallet.controller';
@Module({
  controllers: [WalletController],
  providers: [WalletService, ...WalletProviders],
  exports: [WalletService],
  imports: [DatabaseModule],
})
export class WalletModule {}
