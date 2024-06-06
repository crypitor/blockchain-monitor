import { ErrorCode } from '@app/global/global.error';
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { Strategy } from 'passport-http-header-strategy';
import { UsersService } from '../../users/users.service';
import { ApiKeyRepository } from '../../apikey/repositories/apikey.repository';
import { ApiKeyUser } from '../../apikey/schemas/apikey.schema';

@Injectable()
export class ApikeyStrategy extends PassportStrategy(Strategy, 'apikey') {
  constructor(
    private readonly apikeyRepository: ApiKeyRepository,
    private readonly userService: UsersService,
  ) {
    super({
      header: 'x-api-key',
      passReqToCallback: true,
    });
  }

  async validate(req: Request, token: string) {
    const apikey = await this.apikeyRepository.findByApiKey(token);
    if (!apikey) {
      throw ErrorCode.UNAUTHORIZED.asException();
    }
    const projectId = this.extracProjectId(req);
    if (projectId && projectId !== '' && projectId !== apikey.projectId) {
      throw ErrorCode.PROJECT_FORBIDDEN.asException();
    }
    const user = await this.userService.findOneByUserId(apikey.userId);
    if (!user) {
      throw ErrorCode.UNAUTHORIZED.asException();
    }
    return ApiKeyUser.from(user, apikey);
  }

  private extracProjectId(request: Request): string {
    let projectId = request.query['projectId'];
    if (projectId && projectId != '') {
      return projectId as string;
    }
    projectId = request.body.projectId;
    if (projectId && projectId != '') {
      return projectId as string;
    }
    return null;
  }
}
