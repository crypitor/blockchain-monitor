import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';

@Injectable()
export class WorkerServiceService {
  constructor(
    @Inject('MONITOR_CLIENT_SERVICE') private monitorClient: ClientKafka,
  ) {}

  getHello(): string {
    console.log('Emit blockchain-event to kafka');
    this.monitorClient.emit('blockchain-event', { userId: 'abc' });
    return 'Hello World!';
  }
}
