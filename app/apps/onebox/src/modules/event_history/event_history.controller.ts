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
}
