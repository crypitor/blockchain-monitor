import { NestFactory } from '@nestjs/core';
import { MonitorServiceModule } from './monitor-service.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    MonitorServiceModule,
    {
      transport: Transport.KAFKA,
      options: {
        client: {
          brokers: process.env.KAFKA_BROKERS.split(','),
        },
        consumer: {
          groupId: 'blockchain-event-consumer',
        },
      },
    },
  );
  app.listen();
}
bootstrap();
