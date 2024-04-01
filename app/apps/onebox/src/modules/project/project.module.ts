import { ProjectModelModule } from '@app/shared_modules/project/project.model.module';
import { Module } from '@nestjs/common';
import { ProjectController } from './project.controller';
import { ProjectService } from './project.service';
@Module({
  controllers: [ProjectController],
  providers: [ProjectService],
  exports: [ProjectService],
  imports: [ProjectModelModule],
})
export class ProjectModule {}
