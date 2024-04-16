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
import { DeliveryService } from './delivery.service';
import {
  GetMonitorDeliveryDto,
  MonitorDeliveryResponseDto,
} from './dto/delivery.dto';

@ApiTags('Monitor Delivery')
@Controller('/delivery')
export class DeliveryController {
  constructor(private readonly deliveryService: DeliveryService) {}

  @ApiOperation({ summary: 'Get Monitor Deliveries' })
  @ApiBearerAuth('JWT')
  @UseGuards(JwtAuthGuard)
  @Get('')
  @ApiOkResponse({ type: [MonitorDeliveryResponseDto] })
  async getMonitorDeliveries(
    @Req() req: Request,
    @Query() body: GetMonitorDeliveryDto,
  ): Promise<MonitorDeliveryResponseDto[]> {
    return await this.deliveryService.getMonitorDeliveries(
      req.user as User,
      body,
    );
  }
}
