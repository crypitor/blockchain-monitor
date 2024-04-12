import { Module } from '@nestjs/common';
import { NetworkController } from './network.controller';
@Module({
  controllers: [NetworkController],
  providers: [],
  exports: [],
})
export class NetworkModule {}
