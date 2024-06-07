import {
  EventHistory,
  WebhookCategory,
  WebhookType,
} from '@app/shared_modules/event_history/schemas/event_history.schema';
import { ApiProperty, ApiResponseProperty } from '@nestjs/swagger';
import { Builder } from 'builder-pattern';
import { Transform } from 'class-transformer';
import { IsNotEmpty, Max, Min } from 'class-validator';

export class GetMonitorEventHistoryDto {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  monitorId: string;

  // @ApiProperty({ required: false })
  // status?: 'succeeded' | 'pending' | 'failed';

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

export class GetMonitorEventHistoryByAssociatedAddressDto extends GetMonitorEventHistoryDto {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  associatedAddress: string;
}

export class GetMonitorEventHistoryByHashDto extends GetMonitorEventHistoryDto {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  hash: string;
}

export class GetMonitorEventHistoryByEventIdDto {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  monitorId: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  eventId: string;
}

export class MonitorEventHistoryResponseDto {
  @ApiResponseProperty()
  eventId: string; // md5 of message exclude timestamp and confirm

  @ApiResponseProperty()
  chain: string;

  @ApiResponseProperty()
  monitorId: string;

  @ApiResponseProperty()
  associatedAddress: string;

  @ApiResponseProperty()
  hash: string;

  @ApiResponseProperty()
  blockNumber: number; // decimal string

  @ApiResponseProperty()
  contract: {
    address: string;
    name: string;
    symbol: string;
  };

  @ApiResponseProperty()
  fromAddress: string;

  @ApiResponseProperty()
  toAddress: string;

  @ApiResponseProperty()
  tokenId: string; // decimal string

  @ApiResponseProperty()
  tokenValue: string; // decimal string

  @ApiResponseProperty()
  nativeAmount: string; // decimal string

  @ApiResponseProperty()
  type: WebhookType;

  @ApiResponseProperty()
  confirm: boolean;

  @ApiResponseProperty()
  category: WebhookCategory;

  @ApiResponseProperty()
  rawLog: {
    topics: string[];
    data: string;
  };

  @ApiResponseProperty()
  logIndex: number;

  @ApiResponseProperty()
  txnIndex: number;

  @ApiResponseProperty()
  tags: string[];

  @ApiResponseProperty()
  dateCreated: Date;

  @ApiResponseProperty()
  deliveryIds: string[];

  static from(dto: EventHistory): MonitorEventHistoryResponseDto {
    return Builder<MonitorEventHistoryResponseDto>()
      .eventId(dto.eventId)
      .chain(dto.chain)
      .monitorId(dto.monitorId)
      .associatedAddress(dto.associatedAddress)
      .hash(dto.hash)
      .blockNumber(dto.blockNumber)
      .contract(dto.contract)
      .fromAddress(dto.fromAddress)
      .toAddress(dto.toAddress)
      .tokenId(dto.tokenId)
      .tokenValue(dto.tokenValue)
      .nativeAmount(dto.nativeAmount)
      .type(dto.type)
      .confirm(dto.confirm)
      .category(dto.category)
      .rawLog(dto.rawLog)
      .logIndex(dto.logIndex)
      .txnIndex(dto.txnIndex)
      .tags(dto.tags)
      .dateCreated(dto.dateCreated)
      .deliveryIds(dto.deliveryIds)
      .build();
  }
}
