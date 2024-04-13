import { Module } from '@nestjs/common';
import { GlobalController } from './global.controller';
import { GlobalService } from './global.service';

@Module({
  controllers: [GlobalController],
  providers: [GlobalService],
  exports: [GlobalService],
})
export class GlobalModule {}
