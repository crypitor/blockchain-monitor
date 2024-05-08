import { ErrorCode } from '@app/global/global.error';
import { ApiKeyRepository } from '@app/shared_modules/apikey/repositories/apikey.repository';
import {
  ApiKey,
  ApiKeyStatus,
} from '@app/shared_modules/apikey/schemas/apikey.schema';
import { shortUUID } from '@app/utils/uuidUtils';
import { Injectable } from '@nestjs/common';
import { Builder } from 'builder-pattern';
import { ProjectService } from '../project/project.service';
import { User } from '../users/schemas/user.schema';
import {
  ApiKeyResponseDto,
  CreateApiKeyDto,
  DeleteApiKeyResponseDto,
  UpdateApiKeyDto,
} from './dto/apikey.dto';

@Injectable()
export class ApikeyService {
  constructor(
    private readonly apiKeyRepository: ApiKeyRepository,
    private readonly projectService: ProjectService,
  ) {}

  async createApiKey(
    user: User,
    request: CreateApiKeyDto,
  ): Promise<ApiKeyResponseDto> {
    const member = await this.projectService.checkProjectPermission(
      user,
      request.projectId,
    );

    const apiKey = Builder<ApiKey>()
      .apiKey(shortUUID(32))
      .userId(member.userId)
      .projectId(member.projectId)
      .name(request.name)
      .description(request.description)
      .status(ApiKeyStatus.ENABLE)
      .dateCreated(new Date())
      .build();
    await this.apiKeyRepository.saveApiKey(apiKey);
    return ApiKeyResponseDto.from(apiKey);
  }

  async updateApikey(
    user: User,
    request: UpdateApiKeyDto,
  ): Promise<ApiKeyResponseDto> {
    const apiKey = await this.apiKeyRepository.findByApiKey(request.apiKey);
    if (!apiKey) {
      throw ErrorCode.APIKEY_NOT_FOUND.asException();
    }

    const member = await this.projectService.checkProjectPermission(
      user,
      apiKey.projectId,
    );

    const updateMap = new Map<string, any>();
    if (request.name) {
      updateMap['name'] = request.name;
    }
    if (request.description) {
      updateMap['description'] = request.description;
    }
    if (request.status) {
      updateMap['status'] = request.status;
    }
    const updatedApikey = await this.apiKeyRepository.updateApiKey(
      apiKey.apiKey,
      updateMap,
    );
    return ApiKeyResponseDto.from(updatedApikey);
  }

  async deleteApikey(
    user: User,
    apiKeyId: string,
  ): Promise<DeleteApiKeyResponseDto> {
    const apiKey = await this.apiKeyRepository.findByApiKey(apiKeyId);
    if (!apiKey) {
      throw ErrorCode.APIKEY_NOT_FOUND.asException();
    }

    const member = await this.projectService.checkProjectPermission(
      user,
      apiKey.projectId,
    );

    await this.apiKeyRepository.deleteApiKey(apiKey.apiKey);

    return Builder<DeleteApiKeyResponseDto>().success(true).build();
  }

  async getApiKey(user: User, apiKeyId: string): Promise<ApiKeyResponseDto> {
    const apiKey = await this.apiKeyRepository.findByApiKey(apiKeyId);
    if (!apiKey) {
      throw ErrorCode.APIKEY_NOT_FOUND.asException();
    }

    const member = await this.projectService.checkProjectPermission(
      user,
      apiKey.projectId,
    );
    return ApiKeyResponseDto.from(apiKey);
  }

  async listApiKeys(
    user: User,
    projectId: string,
  ): Promise<ApiKeyResponseDto[]> {
    const member = await this.projectService.checkProjectPermission(
      user,
      projectId,
    );
    const apiKeys = await this.apiKeyRepository.listByProjectId(projectId);
    return apiKeys.map((apiKey) => ApiKeyResponseDto.from(apiKey));
  }
}
