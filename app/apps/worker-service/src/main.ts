import { NestFactory } from '@nestjs/core';
import { WorkerServiceModule } from './worker-service.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { LogLevel } from '@nestjs/common';

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
      logger:
        process.env.LOGS !== undefined
          ? (process.env.LOGS.split(',') as LogLevel[])
          : ['error', 'warn', 'log', 'fatal', 'debug', 'verbose'],
    },
  );
  await app.listen();
}
bootstrap();
