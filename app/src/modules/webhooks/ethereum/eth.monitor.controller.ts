import {
  Body,
  Controller,
  Post,
  Req,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreateEthMonitorDto } from './dto/eth.create-monitor.dto';
import { DeleteMonitorDto } from './dto/eth.delete-monitor.dto';
import { CreateEthMonitorValidationPipe } from './eth.monitor.pipe';
import { EthMonitorService } from './eth.monitor.service';
import { EthMonitor } from './schemas/eth.monitor.schema';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';

@ApiTags('Webhook Monitoing')
@ApiBearerAuth('JWT')
@Controller('monitor/eth')
export class EthMonitorController {
  constructor(private ethMonitorService: EthMonitorService) {}

  @Post('/create')
  @UseGuards(JwtAuthGuard)
  @UsePipes(new CreateEthMonitorValidationPipe())
  async create(@Req() req: any, @Body() createMonitorDto: CreateEthMonitorDto) {
    const user = req.user;
    const result: InstanceType<typeof EthMonitor> =
      await this.ethMonitorService.create(user, createMonitorDto);
    return result;
  }

  @Post('/remove')
  @UseGuards(JwtAuthGuard)
  @UsePipes(new CreateEthMonitorValidationPipe())
  async remove(@Req() req: any, @Body() webhookDto: DeleteMonitorDto) {
    await this.ethMonitorService.deleteOne(webhookDto.monitorId);
  }
}
