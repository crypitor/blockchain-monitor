import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { ApiKey, ApiKeyStatus } from '../schemas/apikey.schema';

@Injectable()
export class ApiKeyRepository {
  constructor(
    @Inject('APIKEY_MODEL') private readonly apiKeyModel: Model<ApiKey>,
  ) {}

  async findByApiKey(apiKey: string): Promise<ApiKey> {
    return await this.apiKeyModel.findOne({ apiKey });
  }

  async listByProjectId(projectId: string): Promise<ApiKey[]> {
    return await this.apiKeyModel.find({ projectId });
  }

  async saveApiKey(apiKey: ApiKey): Promise<ApiKey> {
    return new this.apiKeyModel(apiKey).save();
  }

  async updateStatus(apiKey: string, status: ApiKeyStatus): Promise<ApiKey> {
    return await this.apiKeyModel.findOneAndUpdate(
      { apiKey },
      { status },
      { new: true },
    );
  }

  async updateApiKey(
    apiKey: string,
    updateMap: Map<string, any>,
  ): Promise<ApiKey> {
    return this.apiKeyModel
      .findOneAndUpdate(
        { apiKey: apiKey },
        {
          $set: {
            ...updateMap,
          },
        },
        {
          new: true,
        },
      )
      .exec();
  }

  async deleteApiKey(apiKey: string): Promise<ApiKey> {
    return await this.apiKeyModel.findOneAndDelete({ apiKey });
  }
}
