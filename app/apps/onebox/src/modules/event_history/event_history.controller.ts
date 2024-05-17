import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Request } from 'express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { User } from '../users/schemas/user.schema';
import {
  GetMonitorEventHistoryByAssociatedAddressDto,
  GetMonitorEventHistoryByEventIdDto,
  GetMonitorEventHistoryByHashDto,
  GetMonitorEventHistoryDto,
  MonitorEventHistoryResponseDto,
} from './dto/event_history.dto';
import { EventHistoryService } from './event_history.service';

@ApiTags('Monitor Event History')
@Controller('/event')
export class EventHistoryController {
  constructor(private readonly eventHistoryService: EventHistoryService) {}

  @ApiOperation({ summary: 'Get Monitor Event' })
  @ApiBearerAuth('JWT')
  @UseGuards(JwtAuthGuard)
  @Get('')
  @ApiOkResponse({ type: [MonitorEventHistoryResponseDto] })
  async getMonitorEvent(
    @Req() req: Request,
    @Query() body: GetMonitorEventHistoryDto,
  ): Promise<MonitorEventHistoryResponseDto[]> {
    return await this.eventHistoryService.getMonitorEventHistory(
      req.user as User,
      body,
    );
  }

  @ApiOperation({ summary: 'Get Monitor Event History By Transaction Hash' })
  @ApiBearerAuth('JWT')
  @UseGuards(JwtAuthGuard)
  @Get('by-hash')
  @ApiOkResponse({ type: [MonitorEventHistoryResponseDto] })
  async getMonitorEventHistoryByTxnHash(
    @Req() req: Request,
    @Query() body: GetMonitorEventHistoryByHashDto,
  ): Promise<MonitorEventHistoryResponseDto[]> {
    return await this.eventHistoryService.getMonitorEventHistoryByTxnHash(
      req.user as User,
      body,
    );
  }

  @ApiOperation({ summary: 'Get Monitor Event History By Event Id' })
  @ApiBearerAuth('JWT')
  @UseGuards(JwtAuthGuard)
  @Get('by-event-id')
  @ApiOkResponse({ type: [MonitorEventHistoryResponseDto] })
  async getMonitorEventHistoryByEventId(
    @Req() req: Request,
    @Query() body: GetMonitorEventHistoryByEventIdDto,
  ): Promise<MonitorEventHistoryResponseDto> {
    return await this.eventHistoryService.getMonitorEventHistoryByEventId(
      req.user as User,
      body,
    );
  }

  @ApiOperation({ summary: 'Get Monitor Event History By Associated Address' })
  @ApiBearerAuth('JWT')
  @UseGuards(JwtAuthGuard)
  @Get('by-address')
  @ApiOkResponse({ type: [MonitorEventHistoryResponseDto] })
  async getMonitorEventHistoryByAssociatedAddress(
    @Req() req: Request,
    @Query() body: GetMonitorEventHistoryByAssociatedAddressDto,
  ): Promise<MonitorEventHistoryResponseDto[]> {
    return await this.eventHistoryService.getMonitorEventHistoryByAssociatedAddress(
      req.user as User,
      body,
    );
  }
}
