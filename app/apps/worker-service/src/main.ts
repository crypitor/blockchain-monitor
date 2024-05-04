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
          clientId: 'worker-server',
          brokers: process.env.KAFKA_BROKERS.split(','),
          ssl: process.env.KAFKA_SSL === 'true',
          sasl:
            process.env.KAFKA_AUTH_ENABLE === 'true'
              ? {
                  mechanism: 'plain',
                  username: process.env.KAFKA_USERNAME || '',
                  password: process.env.KAFKA_PASSWORD || '',
                }
              : null,
          retry: {
            restartOnFailure: async (e) => {
              console.log('RESTART ON FAILURE worker server');
              console.log(e);
              return true;
            },
          },
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
