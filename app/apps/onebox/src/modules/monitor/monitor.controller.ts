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
import { CreateMonitorDto, MonitorResponseDto } from './dto/monitor.dto';
import { MonitorService } from './monitor.service';

@ApiTags('Monitor')
@Controller('monitor')
export class MonitorController {
  constructor(private readonly monitorService: MonitorService) {}

  @ApiBearerAuth('JWT')
  @UseGuards(JwtAuthGuard)
  @Get('')
  @ApiOkResponse({ type: MonitorResponseDto })
  async getMonitor(
    @Req() req: Request,
    @Query('id') monitorId: string,
  ): Promise<MonitorResponseDto> {
    return await this.monitorService.getMonitor(req.user as User, monitorId);
  }

  @ApiBearerAuth('JWT')
  @UseGuards(JwtAuthGuard)
  @Get('list')
  @ApiOkResponse({ type: [MonitorResponseDto] })
  async listMonitor(
    @Req() req: Request,
    @Query('projectId') projectId: string,
  ): Promise<MonitorResponseDto[]> {
    return await this.monitorService.listMonitors(req.user as User, projectId);
  }

  @ApiBearerAuth('JWT')
  @UseGuards(JwtAuthGuard)
  @Post('create')
  @ApiCreatedResponse({ type: MonitorResponseDto })
  async createMonitor(
    @Req() req: Request,
    @Body() body: CreateMonitorDto,
  ): Promise<MonitorResponseDto> {
    return await this.monitorService.createMonitor(req.user as User, body);
  }
}
