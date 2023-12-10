import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { CreateERC721TokenInfoDto } from './dto/create-erc721-tokeninfo.dto';
import { ERC721 } from './schemas/erc721.schema';

@Injectable()
export class ERC721Service {
  constructor(@Inject('ERC721_MODEL') private readonly erc721Model: Model<ERC721>) {}

  async create(createERC721Dto: CreateERC721TokenInfoDto): Promise<ERC721> {
    const createdERC721 = new this.erc721Model(createERC721Dto);
    try {
      return await createdERC721.save();
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get all ERC721.
   *
   * @returns {ERC721[]}
   */
  async findAll(): Promise<ERC721[]> {
    return this.erc721Model.find().exec();
  }

  /**
   * Find a single ERC721 by their address.
   *
   * @param address The ERC721 address to filter by.
   * @returns {ERC721}
   */
  async findOne(address: string): Promise<ERC721 | undefined> {
    return this.erc721Model.findOne({ address: address });
  }

  async deleteOne(address: string): Promise<void> {
    try {
      await this.erc721Model.deleteOne({ address: address });
    } catch (error) {
      throw error;
    }
  }
}
