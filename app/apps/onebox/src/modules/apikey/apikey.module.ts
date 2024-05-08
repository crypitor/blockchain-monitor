import { ApiKeyModule as ApiKeyModelModule } from '@app/shared_modules/apikey/apikey.module';
import { Module } from '@nestjs/common';
import { ProjectModule } from '../project/project.module';
import { ApiKeyController } from './apikey.controller';
import { ApikeyService } from './apikey.service';
@Module({
  controllers: [ApiKeyController],
  providers: [ApikeyService],
  exports: [ApikeyService],
  imports: [ApiKeyModelModule, ProjectModule],
})
export class ApikeyModule {}
