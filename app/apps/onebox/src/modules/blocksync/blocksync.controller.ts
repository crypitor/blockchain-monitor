import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import {
  BlockSync,
  BlockSyncRepository,
  CreateBlockSyncDto,
  DeleteBlockSyncDto,
} from 'libs';

@Controller('blocksync')
export class BlockSyncController {
  constructor(private blockSyncRepository: BlockSyncRepository) {}

  @Post('/create')
  async create(@Body() blockSync: CreateBlockSyncDto) {
    try {
      const result: InstanceType<typeof BlockSync> =
        await this.blockSyncRepository.create(blockSync);

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
  async remove(@Body() blockSync: DeleteBlockSyncDto) {
    try {
      await this.blockSyncRepository.deleteOne(blockSync.rpcUrl);
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
