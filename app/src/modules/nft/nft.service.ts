import { Injectable } from '@nestjs/common';
import { CreateNftDto } from './dto/create-nft.dto';
import { UpdateNftDto } from './dto/update-nft.dto';
import { ethers } from 'ethers';

@Injectable()
export class NftService {
  private provider: ethers.Provider;
  // todo connect ethers to constructor for ether provider
  constructor() {
    this.provider = new ethers.JsonRpcProvider(process.env.WEB3_PROVIDER_URL);
  }
  async tokenUri(tokenId: string) {
    throw new Error('Method not implemented.');
  }
  balanceOf(address: string) {
    throw new Error('Method not implemented.');
  }
  create(createNftDto: CreateNftDto) {
    return 'This action adds a new nft';
  }

  findAll() {
    return `This action returns all nft`;
  }

  findOne(id: number) {
    return `This action returns a #${id} nft`;
  }

  update(id: number, updateNftDto: UpdateNftDto) {
    return `This action updates a #${id} nft`;
  }

  remove(id: number) {
    return `This action removes a #${id} nft`;
  }
}
