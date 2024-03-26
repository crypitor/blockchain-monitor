import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersProviders } from './users.providers';
import { UsersController } from './users.controller';
import { DatabaseModule } from '@app/database';
@Module({
  controllers: [UsersController],
  providers: [UsersService, ...UsersProviders],
  exports: [UsersService],
  imports: [DatabaseModule],
})
export class UsersModule {}
