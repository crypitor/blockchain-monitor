import { Module } from '@nestjs/common';
import { ERC721Service } from './erc721.service';
import { DatabaseModule } from 'src/database/database.module';
import { ERC721Providers } from './erc721.providers';
import { ERC721Controller } from './erc721.controller';
@Module({
  controllers: [ERC721Controller],
  providers: [ERC721Service, ...ERC721Providers],
  exports: [ERC721Service],
  imports: [DatabaseModule],
})
export class ERC721Module {}
