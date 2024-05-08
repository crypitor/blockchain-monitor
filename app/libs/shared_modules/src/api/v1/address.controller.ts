import { ApiKeyUser } from '@app/shared_modules/apikey/schemas/apikey.schema';
import { Body, Controller, Delete, Post, Req, UseGuards } from '@nestjs/common';
import {
  ApiBasicAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { MonitorAddressService } from 'apps/onebox/src/modules/address/address.service';
import {
  CreateMonitorAddressDto,
  DeleteMonitorAddressDto,
  DeleteMonitorAddressResponseDto,
  MonitorAddressResponseDto,
} from 'apps/onebox/src/modules/address/dto/address.dto';
import { Request } from 'express';
import { ApikeyGuard } from '../auth/apikey.guard';

@ApiTags('Api V1 / Monitor Address')
@Controller('/api/v1/monitor-addresses')
@ApiBasicAuth('apiKey')
@UseGuards(ApikeyGuard)
export class MonitorAddressController {
  constructor(private readonly monitorAddressService: MonitorAddressService) {}

  @ApiOperation({ summary: 'Create Monitor Addresses' })
  @Post('')
  @ApiCreatedResponse({ type: [MonitorAddressResponseDto] })
  async createMonitorAddress(
    @Req() req: Request,
    @Body() body: CreateMonitorAddressDto,
  ): Promise<MonitorAddressResponseDto[]> {
    return this.monitorAddressService.createMonitorAddress(
      req.user as ApiKeyUser,
      body,
    );
  }

  @ApiOperation({ summary: 'Delete Monitor Addresses' })
  @Delete('')
  @ApiOkResponse({ type: DeleteMonitorAddressResponseDto })
  async deleteMonitorAddress(
    @Req() req: Request,
    @Body() body: DeleteMonitorAddressDto,
  ): Promise<DeleteMonitorAddressResponseDto> {
    return this.monitorAddressService.deleteMonitorAddress(
      req.user as ApiKeyUser,
      body,
    );
  }
}
