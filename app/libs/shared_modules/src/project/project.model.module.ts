import { DatabaseModule } from '@app/database';
import { Module } from '@nestjs/common';
import { ProjectModelProviders } from './project.model.provider';

@Module({
  imports: [DatabaseModule],
  providers: [...ProjectModelProviders],
  exports: [...ProjectModelProviders],
})
export class ProjectModelModule {}
