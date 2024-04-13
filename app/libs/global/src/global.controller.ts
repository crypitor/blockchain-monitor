import { MonitorNetwork } from '@app/shared_modules/monitor/schemas/monitor.schema';
import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ErrorCode } from './global.error';

@ApiTags('Global')
@Controller('global')
export class GlobalController {
  @ApiOperation({ summary: 'List all networks' })
  @ApiOkResponse({ type: [MonitorNetwork] })
  @Get('/networks')
  async getNetworks(): Promise<MonitorNetwork[]> {
    return Object.values(MonitorNetwork);
  }

  @ApiOperation({ summary: 'List all error codes' })
  @ApiOkResponse({ type: [ErrorCode] })
  @Get('/error-codes')
  async getErrorCodes(): Promise<ErrorCode[]> {
    return ErrorCode.ALL_ERRORS;
  }
}
