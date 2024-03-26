import { NftUtil } from '@app/utils/evm-rpc';
import { Injectable } from '@nestjs/common';
import { ethers } from 'ethers';

@Injectable()
export class NftService {
  private provider: ethers.Provider;
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
    const result = await fetch(tokenUri);
    return result.json();
  }

  async ownerOf(tokenId: string) {
    return await NftUtil.ownerOf(tokenId);
  }
}
