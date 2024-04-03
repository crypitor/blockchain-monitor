import {
  MonitorCondition,
  MonitorNetwork,
} from '@app/shared_modules/monitor/schemas/monitor.schema';
import { ApiProperty } from '@nestjs/swagger';

export class CreateMonitorDto {
  @ApiProperty()
  projectId: string;

  @ApiProperty()
  network: MonitorNetwork;

  @ApiProperty()
  condition: MonitorCondition;
}
