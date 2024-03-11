import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
import {
  FilterValue,
  MonitorCondition,
  MonitoringType,
  NotificationMethod,
} from '../schemas/eth.monitor.schema';

export class CreateEthMonitorDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MaxLength(42)
  address: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  condition: MonitorCondition;

  @ApiProperty()
  @IsNotEmpty()
  type: MonitoringType;

  @ApiProperty()
  @IsNotEmpty()
  notificationMethods: NotificationMethod[];

  @ApiProperty()
  filter: FilterValue;

  @ApiProperty()
  note: string;
}
