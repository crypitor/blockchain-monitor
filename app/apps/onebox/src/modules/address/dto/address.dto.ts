import { MonitorAddress } from '@app/shared_modules/monitor/schemas/monitor.address.schema';
import { MonitorNetwork } from '@app/shared_modules/monitor/schemas/monitor.schema';
import { ApiProperty, ApiResponseProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsNotEmpty,
  IsNumber,
  Max,
  Min,
} from 'class-validator';

export class CreateMonitorAddressDto {
  @ApiProperty()
  @IsNotEmpty()
  monitorId: string;

  @ApiProperty({ type: String, isArray: true })
  @IsNotEmpty()
  @ArrayMaxSize(50)
  @ArrayMinSize(1)
  addresses: string[];
}

export class MonitorAddressResponseDto {
  @ApiResponseProperty()
  monitorId: string;

  @ApiResponseProperty()
  address: string;

  @ApiResponseProperty({ enum: MonitorNetwork })
  network: MonitorNetwork;

  @ApiResponseProperty()
  dateCreated: Date;

  static from(address: MonitorAddress): MonitorAddressResponseDto {
    return {
      monitorId: address.monitorId,
      address: address.address,
      network: address.network,
      dateCreated: address.dateCreated,
    };
  }
}

export class GetMonitorAddressRequestDto {
  @ApiProperty()
  @IsNotEmpty()
  monitorId: string;

  @ApiProperty()
  @IsNumber()
  @Min(1)
  @Max(10)
  @Transform(({ value }) => Number.parseInt(value))
  limit: number;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  @Transform(({ value }) => Number.parseInt(value))
  offset: number;
}

export class GetMonitorAddressResponseDto {
  @ApiResponseProperty()
  addresses: MonitorAddressResponseDto[];
}
