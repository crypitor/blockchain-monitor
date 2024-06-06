import { ApiProperty, ApiResponseProperty } from '@nestjs/swagger';
import { Builder } from 'builder-pattern';
import { ApiKey, ApiKeyStatus } from '../schemas/apikey.schema';

export class CreateApiKeyDto {
  @ApiProperty()
  projectId: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  description: string;
}

export class ApiKeyResponseDto {
  @ApiResponseProperty()
  apiKey: string;

  @ApiResponseProperty()
  projectId: string;

  @ApiResponseProperty()
  name: string;

  @ApiResponseProperty()
  description: string;

  @ApiResponseProperty({ type: 'enum', enum: ApiKeyStatus })
  status: ApiKeyStatus;

  @ApiResponseProperty()
  dateCreated: Date;

  static from(apiKey: ApiKey): ApiKeyResponseDto {
    return Builder<ApiKeyResponseDto>()
      .apiKey(apiKey.apiKey)
      .projectId(apiKey.projectId)
      .name(apiKey.name)
      .description(apiKey.description)
      .status(apiKey.status)
      .dateCreated(apiKey.dateCreated)
      .build();
  }
}

export class UpdateApiKeyDto {
  apiKey: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  description: string;

  @ApiProperty({ type: 'enum', enum: ApiKeyStatus })
  status: ApiKeyStatus;
}

export class DeleteApiKeyResponseDto {
  @ApiResponseProperty()
  success: boolean;
}
