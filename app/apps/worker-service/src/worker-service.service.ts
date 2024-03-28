import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';

@Injectable()
export class WorkerServiceService {
  constructor(@Inject('MONITOR_SERVICE') private client: ClientKafka) {}
  getHello(): string {
    console.log('Emit blockchain-event to kafka');
    this.client.emit('blockchain-event', { userId: 'abc' });
    return 'Hello World!';
  }
}
