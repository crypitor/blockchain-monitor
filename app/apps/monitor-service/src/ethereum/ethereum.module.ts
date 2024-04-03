import { Module } from '@nestjs/common';
import { EthereumService } from './ethereum.service';
import { EthereumController } from './ethereum.controller';

@Module({
  providers: [EthereumService],
  controllers: [EthereumController],
})
export class EthereumModule {}
