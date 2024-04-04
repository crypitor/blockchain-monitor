import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Request } from 'express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { User } from '../users/schemas/user.schema';
import { MonitorAddressService } from './address.service';
import {
  CreateMonitorAddressDto,
  GetMonitorAddressRequestDto,
  GetMonitorAddressResponseDto,
  MonitorAddressResponseDto,
} from './dto/address.dto';

@ApiTags('Monitor Address')
@Controller('monitor/address')
export class MonitorAddressController {
  constructor(private readonly monitorAddressService: MonitorAddressService) {}

  @ApiBearerAuth('JWT')
  @UseGuards(JwtAuthGuard)
  @Post('create')
  @ApiCreatedResponse({ type: [MonitorAddressResponseDto] })
  async createMonitor(
    @Req() req: Request,
    @Body() body: CreateMonitorAddressDto,
  ): Promise<MonitorAddressResponseDto[]> {
    return this.monitorAddressService.createMonitorAddress(
      req.user as User,
      body,
    );
  }

  @ApiBearerAuth('JWT')
  @UseGuards(JwtAuthGuard)
  @Get('list')
  @ApiOkResponse({ type: GetMonitorAddressResponseDto })
  async getMonitorAddress(
    @Req() req: Request,
    @Query()
    body: GetMonitorAddressRequestDto,
  ): Promise<GetMonitorAddressResponseDto> {
    return this.monitorAddressService.getMonitorAddress(req.user as User, body);
  }
}
