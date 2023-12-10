import {
  Controller,
  Post,
  Body,
  UsePipes,
  BadRequestException,
} from '@nestjs/common';
import { CreateWalletWebhookDto } from './dto/create-wallet.dto';
import { WalletService } from './wallet.service';
import { Model } from 'mongoose';
import { CreateWalletValidationPipe } from './wallet.pipe';
import { Wallet, WalletSchema } from './schemas/wallet.schema';
import { DeleteWalletDto } from './dto/delete-wallet.dto';

@Controller('wallet')
export class WalletController {
  constructor(private WalletService: WalletService) { }

  @Post('/create')
  @UsePipes(new CreateWalletValidationPipe())
  async create(@Body() wallet: CreateWalletWebhookDto) {
    try {
      const result: InstanceType<typeof Wallet> = await this.WalletService.create(
        wallet,
      );
      return result;
    } catch (error) {
      if (error.hasOwnProperty('code')) {
        if (error.name === 'MongoServerError' && error.code === 11000) {
          throw new BadRequestException({
            error: {
              address: {
                notUnique: 'address is already in use by a different id',
              },
            },
          });
        }
      }

      throw new BadRequestException(
        {
          error: error,
        },
        'Bad request',
      );
    }
  }

  @Post('/remove')
  @UsePipes(new CreateWalletValidationPipe())
  async remove(@Body() wallet: DeleteWalletDto) {
    try {
      await this.WalletService.deleteOne(
        wallet.address,
      );
    } catch (error) {
      if (error.hasOwnProperty('code')) {
        if (error.name === 'MongoServerError' && error.code === 11000) {
          throw new BadRequestException({
            error: {
              address: {
                notUnique: 'address is already in use by a different id',
              },
            },
          });
        }
      }

      throw new BadRequestException(
        {
          error: error,
        },
        'Bad request',
      );
    }
  }
}
