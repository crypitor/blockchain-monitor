import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Request } from 'express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { User } from '../users/schemas/user.schema';
import { ApikeyService } from './apikey.service';
import {
  ApiKeyResponseDto,
  CreateApiKeyDto,
  DeleteApiKeyResponseDto,
  UpdateApiKeyDto,
} from './dto/apikey.dto';

@ApiTags('Api Key')
@Controller('apikey')
export class ApiKeyController {
  constructor(private readonly apiKeyService: ApikeyService) {}

  @ApiOperation({ summary: 'Create Apikey' })
  @ApiBearerAuth('JWT')
  @UseGuards(JwtAuthGuard)
  @Post('')
  @ApiCreatedResponse({ type: ApiKeyResponseDto })
  async createApikey(
    @Req() req: Request,
    @Body() body: CreateApiKeyDto,
  ): Promise<ApiKeyResponseDto> {
    return await this.apiKeyService.createApiKey(req.user as User, body);
  }

  @ApiOperation({ summary: 'Get Apikey' })
  @ApiBearerAuth('JWT')
  @UseGuards(JwtAuthGuard)
  @Get('/:apikey')
  @ApiOkResponse({ type: ApiKeyResponseDto })
  async getApikey(
    @Req() req: Request,
    @Param('apikey') apiKey: string,
  ): Promise<ApiKeyResponseDto> {
    return await this.apiKeyService.getApiKey(req.user as User, apiKey);
  }

  @ApiOperation({ summary: 'Update Apikey' })
  @ApiBearerAuth('JWT')
  @UseGuards(JwtAuthGuard)
  @Patch('/:apikey')
  @ApiOkResponse({ type: ApiKeyResponseDto })
  async updateApikey(
    @Req() req: Request,
    @Param('apikey') apiKey: string,
    @Body() body: UpdateApiKeyDto,
  ): Promise<ApiKeyResponseDto> {
    body.apiKey = apiKey;
    return await this.apiKeyService.updateApikey(req.user as User, body);
  }

  @ApiOperation({ summary: 'Delete Apikey' })
  @ApiBearerAuth('JWT')
  @UseGuards(JwtAuthGuard)
  @Delete('/:apikey')
  @ApiOkResponse({ type: DeleteApiKeyResponseDto })
  async deleteApikey(
    @Req() req: Request,
    @Param('apikey') apiKey: string,
  ): Promise<DeleteApiKeyResponseDto> {
    return await this.apiKeyService.deleteApikey(req.user as User, apiKey);
  }

  @ApiOperation({ summary: 'List Apikey' })
  @ApiBearerAuth('JWT')
  @UseGuards(JwtAuthGuard)
  @Get('')
  @ApiOkResponse({ type: [ApiKeyResponseDto] })
  async listApikey(
    @Req() req: Request,
    @Query('projectId') projectId: string,
  ): Promise<ApiKeyResponseDto[]> {
    return await this.apiKeyService.listApiKeys(req.user as User, projectId);
  }
}
