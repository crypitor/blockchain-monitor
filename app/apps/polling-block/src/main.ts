import { NestFactory } from '@nestjs/core';
import { PollingBlockModule } from './polling-block.module';
import { MicroserviceOptions } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    PollingBlockModule,
  );
  await app.listen();
}
bootstrap();
