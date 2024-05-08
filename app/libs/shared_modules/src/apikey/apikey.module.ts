import { DatabaseModule } from '@app/database';
import { Module } from '@nestjs/common';
import { ApiKeyProviders } from './apikey.provider';
import { ApiKeyRepository } from './repositories/apikey.repository';

@Module({
  imports: [DatabaseModule],
  providers: [...ApiKeyProviders, ApiKeyRepository],
  exports: [...ApiKeyProviders, ApiKeyRepository],
})
export class ApiKeyModule {}
