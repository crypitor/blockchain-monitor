import { Module } from '@nestjs/common';
import { ERC721Service } from './erc721.service';
import { ERC721Providers } from './erc721.providers';
import { ERC721Controller } from './erc721.controller';
import { DatabaseModule } from '@app/database';
@Module({
  controllers: [ERC721Controller],
  providers: [ERC721Service, ...ERC721Providers],
  exports: [ERC721Service],
  imports: [DatabaseModule],
})
export class ERC721Module {}
