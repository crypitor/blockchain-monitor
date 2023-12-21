import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { NftService } from './nft.service';
import { CreateNftDto } from './dto/create-nft.dto';
import { UpdateNftDto } from './dto/update-nft.dto';

@Controller('nft')
export class NftController {
  constructor(private readonly nftService: NftService) {}

  // @Post()
  // create(@Body() createNftDto: CreateNftDto) {
  //   return this.nftService.create(createNftDto);
  // }

  // @Get()
  // findAll() {
  //   return this.nftService.findAll();
  // }

  @Get('token/balance/:address')
  async balanceOf(@Param('address') address: string) {
    return this.nftService.balanceOf(address);
  }
  
  @Get('token/uri/:tokenId')
  async tokenUri(@Param('tokenId') tokenId: string) {
    return this.nftService.tokenUri(tokenId);
  }

  @Get('token/metadata/:tokenId')
  async tokenMetadata(@Param('tokenId') tokenId: string) {
    return this.nftService.tokenMetadata(tokenId);
  }

  // @Patch('token/uri/:id')
  // update(@Param('id') id: string, @Body() updateNftDto: UpdateNftDto) {
  //   return this.nftService.update(+id, updateNftDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.nftService.remove(+id);
  // }
}
