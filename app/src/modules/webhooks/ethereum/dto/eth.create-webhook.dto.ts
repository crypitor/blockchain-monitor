import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
import {
  FilterValue,
  MonitoringCondition,
  MonitoringType,
  NotificationMethod,
} from '../schemas/eth.webhook.schema';

export class CreateEthWebhookDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MaxLength(42)
  address: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  condition: MonitoringCondition;

  @ApiProperty()
  crypto: [];

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
