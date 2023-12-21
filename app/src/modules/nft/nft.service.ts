import { Injectable } from '@nestjs/common';
import { CreateNftDto } from './dto/create-nft.dto';
import { UpdateNftDto } from './dto/update-nft.dto';
import { ethers } from 'ethers';
import { NftUtil } from 'src/utils/evm-rpc';

@Injectable()
export class NftService {
  private provider: ethers.Provider;
  // todo connect ethers to constructor for ether provider
  constructor() {
    this.provider = new ethers.JsonRpcProvider(process.env.WEB3_PROVIDER_URL);
  }
  async tokenUri(tokenId: string) {
    return await NftUtil.tokenUri(tokenId);
  }
  async balanceOf(address: string) {
    return await NftUtil.balanceOf(address);
  }

  async tokenMetadata(tokenId: string) {
    const tokenUri = await this.tokenUri(tokenId);
    fetch(tokenUri).then((res) => {
      return res.json();
    })
  }
}
