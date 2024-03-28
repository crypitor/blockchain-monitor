import {
  Controller,
  Post,
  Body,
  UsePipes,
  BadRequestException,
  UseGuards,
} from '@nestjs/common';
import { CreateERC721TokenInfoDto } from './dto/create-erc721-tokeninfo.dto';
import { ERC721Service } from './erc721.service';
import { CreateERC721ValidationPipe } from './erc721.pipe';
import { ERC721 } from './schemas/erc721.schema';
import { DeleteERC721TokenInfoDto } from './dto/delete-erc721-tokeninfo.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('ERC721')
@ApiBearerAuth('JWT')
@Controller('erc721')
export class ERC721Controller {
  constructor(private ERC721Service: ERC721Service) {}

  @Post('/create')
  // @UseGuards(JwtAuthGuard)
  @UsePipes(new CreateERC721ValidationPipe())
  async create(@Body() erc721: CreateERC721TokenInfoDto) {
    const result: InstanceType<typeof ERC721> = await this.ERC721Service.create(
      erc721,
    );
    return result;
  }

  @Post('/remove')
  // @UseGuards(JwtAuthGuard)
  @UsePipes(new CreateERC721ValidationPipe())
  async remove(@Body() erc721: DeleteERC721TokenInfoDto) {
    await this.ERC721Service.deleteOne(erc721.token_address);
  }
}
