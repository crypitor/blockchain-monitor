import { Injectable } from '@nestjs/common';

@Injectable()
export class MonitorServiceService {
  getHello(value: any): string {
    console.log(value);
    return 'Hello World!';
  }
}
