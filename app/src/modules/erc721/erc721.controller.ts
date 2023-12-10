import {
  Controller,
  Post,
  Body,
  UsePipes,
  BadRequestException,
} from '@nestjs/common';
import { CreateERC721TokenInfoDto } from './dto/create-erc721-tokeninfo.dto';
import { ERC721Service } from './erc721.service';
import { Model } from 'mongoose';
import { CreateERC721ValidationPipe } from './erc721.pipe';
import { ERC721 } from './schemas/erc721.schema';
import { DeleteERC721TokenInfoDto } from './dto/delete-erc721-tokeninfo.dto';

@Controller('erc721')
export class ERC721Controller {
  constructor(private ERC721Service: ERC721Service) { }

  @Post('/create')
  @UsePipes(new CreateERC721ValidationPipe())
  async create(@Body() erc721: CreateERC721TokenInfoDto) {
    try {
      const result: InstanceType<typeof ERC721> = await this.ERC721Service.create(
        erc721,
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
  @UsePipes(new CreateERC721ValidationPipe())
  async remove(@Body() erc721: DeleteERC721TokenInfoDto) {
    try {
      await this.ERC721Service.deleteOne(
        erc721.token_address,
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
