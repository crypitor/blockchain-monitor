import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Request } from 'express';
import { DeliveryApiService } from './delivery.api.service';
import {
  DeliveryAttemptResponseDto,
  GetMonitorDeliveryDto,
  MonitorDeliveryResponseDto,
} from './dto/delivery.api.dto';

@ApiTags('Monitor Delivery')
@Controller('/delivery')
export class DeliveryApiController {
  constructor(private readonly deliveryService: DeliveryApiService) {}

  @ApiOperation({ summary: 'Get Monitor Deliveries' })
  @Get('')
  @ApiOkResponse({ type: [MonitorDeliveryResponseDto] })
  async getMonitorDeliveries(
    @Req() req: Request,
    @Query() body: GetMonitorDeliveryDto,
  ): Promise<MonitorDeliveryResponseDto[]> {
    return await this.deliveryService.getMonitorDeliveries(body);
  }

  @ApiOperation({ summary: 'Get Delivery Attempts' })
  @Get('/attempts')
  @ApiOkResponse({ type: [DeliveryAttemptResponseDto] })
  async getDeliveryAttempts(
    @Req() req: Request,
    @Query('deliveryId') deliveryId: string,
  ): Promise<DeliveryAttemptResponseDto[]> {
    return await this.deliveryService.getDeliveryAttempt(deliveryId);
  }
}
