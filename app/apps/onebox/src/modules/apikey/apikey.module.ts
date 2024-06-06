import { DatabaseModule } from '@app/database';
import { Module } from '@nestjs/common';
import { ApiKeyProviders } from './apikey.provider';
import { ApiKeyRepository } from './repositories/apikey.repository';
import { ApiKeyController } from './apikey.controller';
import { ApikeyService } from './apikey.service';
import { ProjectModule } from '../project/project.module';

@Module({
  imports: [DatabaseModule, ProjectModule],
  providers: [...ApiKeyProviders, ApiKeyRepository, ApikeyService],
  exports: [...ApiKeyProviders, ApiKeyRepository, ApikeyService],
  controllers: [ApiKeyController],
})
export class ApiKeyModule {}
