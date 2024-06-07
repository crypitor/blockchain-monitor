import { Controller, Get, Query, Req } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import {
  GetMonitorEventHistoryByAssociatedAddressDto,
  GetMonitorEventHistoryByEventIdDto,
  GetMonitorEventHistoryByHashDto,
  GetMonitorEventHistoryDto,
  MonitorEventHistoryResponseDto,
} from './dto/event_history.api.dto';
import { EventHistoryApiService } from './event_history.api.service';

@ApiTags('Monitor Event History')
@Controller('/event')
export class EventHistoryApiController {
  constructor(private readonly eventHistoryService: EventHistoryApiService) {}

  @ApiOperation({ summary: 'Get Monitor Event' })
  @Get('')
  @ApiOkResponse({ type: [MonitorEventHistoryResponseDto] })
  async getMonitorEvent(
    @Req() req: Request,
    @Query() body: GetMonitorEventHistoryDto,
  ): Promise<MonitorEventHistoryResponseDto[]> {
    return await this.eventHistoryService.getMonitorEventHistory(body);
  }

  @ApiOperation({ summary: 'Get Monitor Event History By Transaction Hash' })
  @Get('by-hash')
  @ApiOkResponse({ type: [MonitorEventHistoryResponseDto] })
  async getMonitorEventHistoryByTxnHash(
    @Req() req: Request,
    @Query() body: GetMonitorEventHistoryByHashDto,
  ): Promise<MonitorEventHistoryResponseDto[]> {
    return await this.eventHistoryService.getMonitorEventHistoryByTxnHash(body);
  }

  @ApiOperation({ summary: 'Get Monitor Event History By Event Id' })
  @Get('by-event-id')
  @ApiOkResponse({ type: [MonitorEventHistoryResponseDto] })
  async getMonitorEventHistoryByEventId(
    @Req() req: Request,
    @Query() body: GetMonitorEventHistoryByEventIdDto,
  ): Promise<MonitorEventHistoryResponseDto> {
    return await this.eventHistoryService.getMonitorEventHistoryByEventId(body);
  }

  @ApiOperation({ summary: 'Get Monitor Event History By Associated Address' })
  @Get('by-address')
  @ApiOkResponse({ type: [MonitorEventHistoryResponseDto] })
  async getMonitorEventHistoryByAssociatedAddress(
    @Req() req: Request,
    @Query() body: GetMonitorEventHistoryByAssociatedAddressDto,
  ): Promise<MonitorEventHistoryResponseDto[]> {
    return await this.eventHistoryService.getMonitorEventHistoryByAssociatedAddress(
      body,
    );
  }
}
