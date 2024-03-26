import { Module } from '@nestjs/common';
import { DatabaseService } from './database.service';
import { Database } from './database.providers';

@Module({
  providers: [DatabaseService, ...Database],
  exports: [DatabaseService, ...Database],
})
export class DatabaseModule {}
