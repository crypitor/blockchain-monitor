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
import {
  CreateMonitorDto,
  DeleteMonitorDto,
  DeleteMonitorResponseDto,
  ListMonitorDto,
  MonitorResponseDto,
  UpdateMonitorDto,
} from 'libs/shared_modules/src/monitor/dto/monitor.dto';
import { MonitorApiService } from './monitor.api.service';

@ApiTags('Monitor')
@Controller('monitor')
export class MonitorApiController {
  constructor(private readonly monitorService: MonitorApiService) {}

  @ApiOperation({ summary: 'Get monitor by id' })
  @Get('/:id')
  @ApiOkResponse({ type: MonitorResponseDto })
  async getMonitor(
    @Req() req: Request,
    @Param('id') monitorId: string,
  ): Promise<MonitorResponseDto> {
    return await this.monitorService.getMonitor(monitorId);
  }

  @ApiOperation({ summary: 'List monitors of project' })
  @Get('')
  @ApiOkResponse({ type: [MonitorResponseDto] })
  async listMonitor(
    @Req() req: Request,
    @Query() body: ListMonitorDto,
  ): Promise<MonitorResponseDto[]> {
    return await this.monitorService.listMonitors(body);
  }

  @ApiOperation({ summary: 'Create monitor' })
  @Post('')
  @ApiCreatedResponse({ type: MonitorResponseDto })
  async createMonitor(
    @Req() req: Request,
    @Body() body: CreateMonitorDto,
  ): Promise<MonitorResponseDto> {
    return await this.monitorService.createMonitor(body);
  }

  @ApiOperation({ summary: 'Delete monitor' })
  @Delete('/:id')
  @ApiOkResponse({ type: DeleteMonitorResponseDto })
  async deleteMonitor(
    @Req() req: Request,
    @Param('id') monitorId: string,
  ): Promise<DeleteMonitorResponseDto> {
    return await this.monitorService.deleteMonitor(
      Builder<DeleteMonitorDto>().monitorId(monitorId).build(),
    );
  }

  @ApiOperation({ summary: 'Update monitor' })
  @Patch('/:id')
  @ApiOkResponse({ type: MonitorResponseDto })
  async updateMonitor(
    @Req() req: Request,
    @Param('id') monitorId: string,
    @Body() body: UpdateMonitorDto,
  ): Promise<MonitorResponseDto> {
    body.monitorId = monitorId;
    return await this.monitorService.updateMonitor(body);
  }
}
