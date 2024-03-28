import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsNotEmpty,
  IsString,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import {
  FilterValue,
  MonitorCondition,
  MonitoringType,
  NotificationMethod,
} from '@app/shared_modules/eth.monitor/schemas/eth.monitor.schema';

export class CreateEthMonitorDto {
  @ApiProperty({
    example: '0xcC9eFE8992b02eaeA81A9129242a05EbCb006931',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(42)
  address: string;

  @ApiProperty({
    example: {
      native: true,
      erc721: true,
      erc20: true,
      specific: false,
      cryptos: [],
    },
  })
  condition: MonitorCondition;

  @ApiProperty({
    example: 'all',
    enum: MonitoringType,
  })
  @IsNotEmpty()
  type: MonitoringType;

  @ApiProperty({
    example: [
      {
        name: 'webhook',
        url: 'https://webhookurl.com',
      },
    ],
    isArray: true,
  })
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => NotificationMethod)
  notificationMethods: NotificationMethod[];

  @ApiProperty()
  filter: FilterValue;

  @ApiProperty()
  note: string;
}
