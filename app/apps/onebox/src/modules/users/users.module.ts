import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersProviders } from './users.providers';
import { UsersController } from './users.controller';
import { DatabaseModule } from '@app/database';
import { ProjectModule } from '../project/project.module';
@Module({
  controllers: [UsersController],
  providers: [UsersService, ...UsersProviders],
  exports: [UsersService],
  imports: [DatabaseModule, ProjectModule],
})
export class UsersModule {}
