import { SupportedChain } from '../../utils/src';
import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ErrorCode } from './global.error';

@ApiTags('Global')
@Controller('global')
export class GlobalController {
  @ApiOperation({ summary: 'List all networks' })
  @ApiOkResponse({ type: [String], isArray: true })
  @Get('/networks')
  async getNetworks(): Promise<any> {
    return [
      { ...SupportedChain.ETH, enable: process.env.EVM_DISABLE === 'false' },
      {
        ...SupportedChain.POLYGON,
        enable: process.env.POLYGON_DISABLE === 'false',
      },
      {
        ...SupportedChain.AVALANCHE,
        enable: process.env.AVAX_DISABLE === 'false',
      },
      {
        ...SupportedChain.BSC,
        enable: process.env.BSC_DISABLE === 'false',
      },
      {
        ...SupportedChain.MANTLE,
        enable: process.env.MANTLE_DISABLE === 'false',
      },
    ];
  }

  @ApiOperation({ summary: 'List all error codes' })
  @ApiOkResponse({ type: [ErrorCode] })
  @Get('/error-codes')
  async getErrorCodes(): Promise<ErrorCode[]> {
    return ErrorCode.ALL_ERRORS;
  }
}
