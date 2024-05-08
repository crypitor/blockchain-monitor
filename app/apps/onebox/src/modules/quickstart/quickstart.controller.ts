import { Body, Controller, Post } from '@nestjs/common';
import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { QuickStartDto, QuickStartResponseDto } from './dto/quickstart.dto';
import { QuickStartService } from './quickstart.service';

@ApiTags('Quickstart')
@Controller('quick-start')
export class QuickstartController {
  constructor(private readonly quickstartService: QuickStartService) {}

  @ApiOperation({ summary: 'Quick Start' })
  @Post('')
  @ApiCreatedResponse({ type: QuickStartResponseDto })
  async quickStart(
    @Body() request: QuickStartDto,
  ): Promise<QuickStartResponseDto> {
    return this.quickstartService.quickStart(request);
  }
}
