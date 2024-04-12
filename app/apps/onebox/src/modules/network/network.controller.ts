import { MonitorNetwork } from '@app/shared_modules/monitor/schemas/monitor.schema';
import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Network')
@Controller('networks')
export class NetworkController {
  @ApiOperation({ summary: 'List all supported networks' })
  @Get('')
  @ApiOkResponse()
  async listNetworks(): Promise<MonitorNetwork[]> {
    return Object.values(MonitorNetwork);
  }
}
