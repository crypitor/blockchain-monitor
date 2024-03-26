import { NestFactory } from '@nestjs/core';
import { MonitorServiceModule } from './monitor-service.module';

async function bootstrap() {
  const app = await NestFactory.create(MonitorServiceModule);
  await app.listen(3000);
}
bootstrap();
