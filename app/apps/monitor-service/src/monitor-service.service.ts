import { Injectable } from '@nestjs/common';

@Injectable()
export class MonitorServiceService {
  getHello(): string {
    return 'Hello World!';
  }
}
