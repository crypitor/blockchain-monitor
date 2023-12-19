import {
  Controller,
  Post,
  Body,
  UsePipes,
  BadRequestException,
  UseGuards,
} from '@nestjs/common';
import { CreateWalletWebhookDto } from './dto/create-wallet.dto';
import { WalletService } from './wallet.service';
import { CreateWalletValidationPipe } from './wallet.pipe';
import { Wallet } from './schemas/wallet.schema';
import { DeleteWalletDto } from './dto/delete-wallet.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Wallet')
@ApiBearerAuth('JWT')
@Controller('wallet')
export class WalletController {
  constructor(private WalletService: WalletService) { }

  @Post('/create')
  // @UseGuards(JwtAuthGuard)
  @UsePipes(new CreateWalletValidationPipe())
  async create(@Body() wallet: CreateWalletWebhookDto) {
    const result: InstanceType<typeof Wallet> = await this.WalletService.create(wallet);
    return result;
  }

  @Post('/remove')
  // @UseGuards(JwtAuthGuard)
  @UsePipes(new CreateWalletValidationPipe())
  async remove(@Body() wallet: DeleteWalletDto) {
    await this.WalletService.deleteOne(wallet.address);
  }
}
