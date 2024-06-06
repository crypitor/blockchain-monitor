import { DatabaseModule } from '@app/database';
import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { MonitorAddressModule } from 'apps/onebox/src/modules/address/address.module';
import { UsersModule } from 'apps/onebox/src/modules/users/users.module';
import { UsersProviders } from 'apps/onebox/src/modules/users/users.providers';
import { ApikeyStrategy } from '../auth/apikey.strategy';
import { MonitorAddressController } from './address.controller';
import { ApiKeyModule } from '../../apikey/apikey.module';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    DatabaseModule,
    ApiKeyModule,
    UsersModule,
    MonitorAddressModule,
  ],
  controllers: [MonitorAddressController],
  providers: [ApikeyStrategy, ...UsersProviders],
  exports: [],
})
export class ApiV1Module {}
