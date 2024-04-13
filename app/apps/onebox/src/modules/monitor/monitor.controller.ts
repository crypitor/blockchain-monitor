import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
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
import { Builder } from 'builder-pattern';
import { Request } from 'express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { User } from '../users/schemas/user.schema';
import {
  CreateMonitorDto,
  DeleteMonitorDto,
  DeleteMonitorResponseDto,
  MonitorResponseDto,
  UpdateMonitorDto,
} from './dto/monitor.dto';
import { MonitorService } from './monitor.service';

@ApiTags('Monitor')
@Controller('monitor')
export class MonitorController {
  constructor(private readonly monitorService: MonitorService) {}

  @ApiOperation({ summary: 'Get monitor by id' })
  @ApiBearerAuth('JWT')
  @UseGuards(JwtAuthGuard)
  @Get('/:id')
  @ApiOkResponse({ type: MonitorResponseDto })
  async getMonitor(
    @Req() req: Request,
    @Param('id') monitorId: string,
  ): Promise<MonitorResponseDto> {
    return await this.monitorService.getMonitor(req.user as User, monitorId);
  }

  @ApiOperation({ summary: 'List monitors of project' })
  @ApiBearerAuth('JWT')
  @UseGuards(JwtAuthGuard)
  @Get('')
  @ApiOkResponse({ type: [MonitorResponseDto] })
  async listMonitor(
    @Req() req: Request,
    @Query('projectId') projectId: string,
  ): Promise<MonitorResponseDto[]> {
    return await this.monitorService.listMonitors(req.user as User, projectId);
  }

  @ApiOperation({ summary: 'Create monitor' })
  @ApiBearerAuth('JWT')
  @UseGuards(JwtAuthGuard)
  @Post('')
  @ApiCreatedResponse({ type: MonitorResponseDto })
  async createMonitor(
    @Req() req: Request,
    @Body() body: CreateMonitorDto,
  ): Promise<MonitorResponseDto> {
    return await this.monitorService.createMonitor(req.user as User, body);
  }

  @ApiOperation({ summary: 'Delete monitor' })
  @ApiBearerAuth('JWT')
  @UseGuards(JwtAuthGuard)
  @Delete('/:id')
  @ApiOkResponse({ type: DeleteMonitorResponseDto })
  async deleteMonitor(
    @Req() req: Request,
    @Param('id') monitorId: string,
  ): Promise<DeleteMonitorResponseDto> {
    return await this.monitorService.deleteMonitor(
      req.user as User,
      Builder<DeleteMonitorDto>().monitorId(monitorId).build(),
    );
  }

  @ApiOperation({ summary: 'Update monitor' })
  @ApiBearerAuth('JWT')
  @UseGuards(JwtAuthGuard)
  @Patch('/:id')
  @ApiOkResponse({ type: MonitorResponseDto })
  async updateMonitor(
    @Req() req: Request,
    @Param('id') monitorId: string,
    @Body() body: UpdateMonitorDto,
  ): Promise<MonitorResponseDto> {
    body.monitorId = monitorId;
    return await this.monitorService.updateMonitor(req.user as User, body);
  }
}
