import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreateEthMonitorDto } from './dto/eth.create-monitor.dto';
import { DeleteMonitorDto } from './dto/eth.delete-monitor.dto';
import { EthMonitorService } from './eth.monitor.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { EthMonitor } from '@app/shared_modules/eth.monitor/schemas/eth.monitor.schema';

@ApiTags('Webhook Monitoring')
@ApiBearerAuth('JWT')
@Controller('monitor/eth')
export class EthMonitorController {
  constructor(private ethMonitorService: EthMonitorService) {}

  @Post('/create')
  @UseGuards(JwtAuthGuard)
  async create(@Req() req: any, @Body() createMonitorDto: CreateEthMonitorDto) {
    const user = req.user;
    const result: InstanceType<typeof EthMonitor> =
      await this.ethMonitorService.create(user, createMonitorDto);
    return result;
  }

  @Post('/remove')
  @UseGuards(JwtAuthGuard)
  async remove(@Req() req: any, @Body() webhookDto: DeleteMonitorDto) {
    await this.ethMonitorService.deleteOne(webhookDto.monitorId);
  }
}
