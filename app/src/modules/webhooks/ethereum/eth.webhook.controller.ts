import {
  Body,
  Controller,
  Post,
  Req,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreateEthWebhookDto } from './dto/eth.create-webhook.dto';
import { DeleteWalletDto } from './dto/eth.delete-webhook.dto';
import { CreateEthWebhookValidationPipe } from './eth.webhook.pipe';
import { EthWebhookService } from './eth.webhook.service';
import { EthWebhook } from './schemas/eth.webhook.schema';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';

@ApiTags('Webhooks')
@ApiBearerAuth('JWT')
@Controller('eth-webhook')
export class EthWebhookController {
  constructor(private ethWebhookService: EthWebhookService) {}

  @Post('/create')
  @UseGuards(JwtAuthGuard)
  @UsePipes(new CreateEthWebhookValidationPipe())
  async create(@Req() req: any, @Body() createWebhookDto: CreateEthWebhookDto) {
    const user = req.user;
    const result: InstanceType<typeof EthWebhook> =
      await this.ethWebhookService.create(user, createWebhookDto);
    return result;
  }

  @Post('/remove')
  @UseGuards(JwtAuthGuard)
  @UsePipes(new CreateEthWebhookValidationPipe())
  async remove(@Req() req: any, @Body() webhookDto: DeleteWalletDto) {
    await this.ethWebhookService.deleteOne(webhookDto.webhookId);
  }
}
