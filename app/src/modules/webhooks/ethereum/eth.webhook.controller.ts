import { Body, Controller, Post, UsePipes } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreateEthWebhookDto } from './dto/eth.create-webhook.dto';
import { DeleteWalletDto } from './dto/eth.delete-webhook.dto';
import { CreateEthWebhookValidationPipe } from './eth.webhook.pipe';
import { EthWebhookService } from './eth.webhook.service';
import { EthWebhook } from './schemas/eth.webhook.schema';

@ApiTags('Webhooks')
@ApiBearerAuth('JWT')
@Controller('eth-webhook')
export class WalletController {
  constructor(private ethWebhookService: EthWebhookService) {}

  @Post('/create')
  // @UseGuards(JwtAuthGuard)
  @UsePipes(new CreateEthWebhookValidationPipe())
  async create(@Body() wallet: CreateEthWebhookDto) {
    const result: InstanceType<typeof EthWebhook> =
      await this.ethWebhookService.create(wallet);
    return result;
  }

  @Post('/remove')
  // @UseGuards(JwtAuthGuard)
  @UsePipes(new CreateEthWebhookValidationPipe())
  async remove(@Body() wallet: DeleteWalletDto) {
    await this.ethWebhookService.deleteOne(wallet.address);
  }
}
