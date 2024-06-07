import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Request } from 'express';
import { MonitorAddressApiService } from './address.service';
import {
  CreateMonitorAddressDto,
  DeleteMonitorAddressDto,
  DeleteMonitorAddressResponseDto,
  GetMonitorAddressRequestDto,
  GetMonitorAddressResponseDto,
  MonitorAddressResponseDto,
  SearchMonitorAddressRequestDto,
} from './dto/address.dto';

@ApiTags('Monitor Address')
@Controller('address')
export class MonitorAddressController {
  constructor(
    private readonly monitorAddressService: MonitorAddressApiService,
  ) {}

  @ApiOperation({ summary: 'Create Monitor Address' })
  @Post('')
  @ApiCreatedResponse({ type: [MonitorAddressResponseDto] })
  async createMonitorAddress(
    @Req() req: Request,
    @Body() body: CreateMonitorAddressDto,
  ): Promise<MonitorAddressResponseDto[]> {
    return this.monitorAddressService.createMonitorAddress(body);
  }

  @ApiOperation({ summary: 'Get Monitor Address' })
  @Get('')
  @ApiOkResponse({ type: GetMonitorAddressResponseDto })
  async getMonitorAddress(
    @Req() req: Request,
    @Query()
    body: GetMonitorAddressRequestDto,
  ): Promise<GetMonitorAddressResponseDto> {
    return this.monitorAddressService.getMonitorAddress(body);
  }

  @ApiOperation({ summary: 'Delete Monitor Address' })
  @Delete('')
  @ApiOkResponse({ type: DeleteMonitorAddressResponseDto })
  async deleteMonitorAddress(
    @Req() req: Request,
    @Body() body: DeleteMonitorAddressDto,
  ): Promise<DeleteMonitorAddressResponseDto> {
    return this.monitorAddressService.deleteMonitorAddress(body);
  }

  @ApiOperation({ summary: 'Search Monitor Address' })
  @Get('/search')
  @ApiOkResponse({ type: GetMonitorAddressResponseDto })
  async searchMonitorAddress(
    @Req() req: Request,
    @Query()
    body: SearchMonitorAddressRequestDto,
  ): Promise<GetMonitorAddressResponseDto> {
    return this.monitorAddressService.searchAddressInMonitor(body);
  }
}
