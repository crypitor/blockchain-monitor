import { NestFactory } from '@nestjs/core';
import { WorkerServiceModule } from './worker-service.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    WorkerServiceModule,
    {
      transport: Transport.KAFKA,
      options: {
        client: {
          brokers: process.env.KAFKA_BROKERS.split(','),
        },
        consumer: {
          groupId: 'worker-consumer',
        },
      },
    },
  );
  await app.listen();
}
bootstrap();
