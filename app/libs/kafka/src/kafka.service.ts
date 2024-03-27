import { Injectable } from '@nestjs/common';
import { Kafka, Producer, Consumer, EachMessagePayload } from 'kafkajs';

@Injectable()
export class KafkaService {
  private kafka: Kafka;
  private producer: Producer;
  private consumer: Consumer;

  constructor() {
    this.kafka = new Kafka({
      brokers: process.env.KAFKA_BROKERS.split(','), // Kafka broker(s) address
    });

    this.producer = this.kafka.producer();
    this.consumer = this.kafka.consumer({ groupId: 'my-group' }); // Specify your consumer group ID
  }

  async connect(): Promise<void> {
    await this.producer.connect();
    await this.consumer.connect();
  }

  async disconnect(): Promise<void> {
    await this.producer.disconnect();
    await this.consumer.disconnect();
  }

  async sendMessage(topic: string, message: string): Promise<void> {
    await this.producer.send({
      topic,
      messages: [{ value: message }],
    });
  }

  async consumeMessages(
    topic: string,
    callback: (message: EachMessagePayload) => Promise<void>,
  ): Promise<void> {
    await this.consumer.subscribe({ topic, fromBeginning: true });

    await this.consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        await callback({
          topic,
          partition,
          message,
          heartbeat: function (): Promise<void> {
            throw new Error('Function not implemented.');
          },
          pause: function (): () => void {
            throw new Error('Function not implemented.');
          },
        });
      },
    });
  }
}
