import {
  Body,
  Controller,
  Delete,
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
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Request } from 'express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { User } from '../users/schemas/user.schema';
import { MonitorAddressService } from './address.service';
import {
  CreateMonitorAddressDto,
  DeleteMonitorAddressDto,
  DeleteMonitorAddressResponseDto,
  GetMonitorAddressRequestDto,
  GetMonitorAddressResponseDto,
  MonitorAddressResponseDto,
} from './dto/address.dto';

@ApiTags('Monitor Address')
@Controller('address')
export class MonitorAddressController {
  constructor(private readonly monitorAddressService: MonitorAddressService) {}

  @ApiOperation({ summary: 'Create Monitor Address' })
  @ApiBearerAuth('JWT')
  @UseGuards(JwtAuthGuard)
  @Post('')
  @ApiCreatedResponse({ type: [MonitorAddressResponseDto] })
  async createMonitorAddress(
    @Req() req: Request,
    @Body() body: CreateMonitorAddressDto,
  ): Promise<MonitorAddressResponseDto[]> {
    return this.monitorAddressService.createMonitorAddress(
      req.user as User,
      body,
    );
  }

  @ApiOperation({ summary: 'Get Monitor Address' })
  @ApiBearerAuth('JWT')
  @UseGuards(JwtAuthGuard)
  @Get('')
  @ApiOkResponse({ type: GetMonitorAddressResponseDto })
  async getMonitorAddress(
    @Req() req: Request,
    @Query()
    body: GetMonitorAddressRequestDto,
  ): Promise<GetMonitorAddressResponseDto> {
    return this.monitorAddressService.getMonitorAddress(req.user as User, body);
  }

  @ApiOperation({ summary: 'Delete Monitor Address' })
  @ApiBearerAuth('JWT')
  @UseGuards(JwtAuthGuard)
  @Delete('')
  @ApiOkResponse({ type: DeleteMonitorAddressResponseDto })
  async deleteMonitorAddress(
    @Req() req: Request,
    @Body() body: DeleteMonitorAddressDto,
  ): Promise<DeleteMonitorAddressResponseDto> {
    return this.monitorAddressService.deleteMonitorAddress(
      req.user as User,
      body,
    );
  }
}
