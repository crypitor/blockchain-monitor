import { DeliveryDto } from '@app/shared_modules/webhook/webhook.service';
import { ApiProperty, ApiResponseProperty } from '@nestjs/swagger';
import { Builder } from 'builder-pattern';
import { Transform } from 'class-transformer';
import { IsNotEmpty, Max, Min } from 'class-validator';

export class GetMonitorDeliveryDto {
  @ApiProperty()
  @IsNotEmpty()
  monitorId: string;

  @ApiProperty({ required: false })
  status?: 'succeeded' | 'pending' | 'failed';

  @ApiProperty({ default: 10 })
  @Max(10)
  @Min(1)
  @Transform(({ value }) => parseInt(value))
  limit: number;

  @ApiProperty({ default: 0 })
  @Min(0)
  @Transform(({ value }) => parseInt(value))
  offset: number;
}

export class MonitorDeliveryResponseDto {
  @ApiResponseProperty()
  id: string;

  @ApiResponseProperty()
  payload: string;

  @ApiResponseProperty()
  status: string;

  @ApiResponseProperty()
  attempts: number;

  @ApiResponseProperty()
  dateScheduled: string;

  @ApiResponseProperty()
  dateCreated: string;

  @ApiResponseProperty()
  dateUpdated: string;

  static from(dto: DeliveryDto): MonitorDeliveryResponseDto {
    return Builder<MonitorDeliveryResponseDto>()
      .id(dto.id)
      .payload(dto.payload)
      .status(dto.status)
      .attempts(dto.delivery_attempts)
      .dateScheduled(dto.scheduled_at)
      .dateCreated(dto.created_at)
      .dateUpdated(dto.updated_at)
      .build();
  }
}
