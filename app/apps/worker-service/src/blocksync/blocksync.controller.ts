import {
  BadRequestException,
  Body,
  Controller,
  Post,
  UsePipes,
} from '@nestjs/common';
import { CreateBlockSyncValidationPipe } from './blocksync.pipe';
import { BlockSyncService } from './blocksync.service';
import { CreateBlockSyncDto } from './dto/create-blocksync.dto';
import { DeleteBlockSyncDto } from './dto/delete-blocksync.dto';
import { BlockSync } from './schemas/blocksync.schema';

@Controller('blocksync')
export class BlockSyncController {
  constructor(private BlockSyncService: BlockSyncService) {}

  @Post('/create')
  @UsePipes(new CreateBlockSyncValidationPipe())
  async create(@Body() blockSync: CreateBlockSyncDto) {
    try {
      const result: InstanceType<typeof BlockSync> =
        await this.BlockSyncService.create(blockSync);

      return result;
    } catch (error) {
      if (error.hasOwnProperty('code')) {
        if (error.name === 'MongoServerError' && error.code === 11000) {
          throw new BadRequestException({
            error: {
              rpcUrl: {
                notUnique: 'rpcUrl is already in use by a different id',
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
  @UsePipes(new CreateBlockSyncValidationPipe())
  async remove(@Body() blockSync: DeleteBlockSyncDto) {
    try {
      await this.BlockSyncService.deleteOne(blockSync.rpcUrl);
    } catch (error) {
      if (error.hasOwnProperty('code')) {
        if (error.name === 'MongoServerError' && error.code === 11000) {
          throw new BadRequestException({
            error: {
              rpcUrl: {
                notUnique: 'rpcUrl is already in use by a different id',
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
