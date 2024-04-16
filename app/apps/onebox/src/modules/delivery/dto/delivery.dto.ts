import {
  DeliveryAttemptDto,
  DeliveryDto,
} from '@app/shared_modules/webhook/webhook.service';
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

export class DeliveryAttemptResponseDto {
  @ApiResponseProperty()
  id: string;

  @ApiResponseProperty()
  deliveryId: string;

  @ApiResponseProperty()
  request: string;

  @ApiResponseProperty()
  response: string;

  @ApiResponseProperty()
  responseStatusCode: number;

  @ApiResponseProperty()
  executionDuration: number;

  @ApiResponseProperty()
  success: boolean;

  @ApiResponseProperty()
  error: string;

  @ApiResponseProperty()
  dateCreated: string;

  static from(dto: DeliveryAttemptDto): DeliveryAttemptResponseDto {
    return Builder<DeliveryAttemptResponseDto>()
      .id(dto.id)
      .deliveryId(dto.delivery_id)
      .request(dto.raw_request)
      .response(dto.raw_response)
      .responseStatusCode(dto.response_status_code)
      .executionDuration(dto.execution_duration)
      .success(dto.success)
      .error(dto.error)
      .dateCreated(dto.created_at)
      .build();
  }
}
