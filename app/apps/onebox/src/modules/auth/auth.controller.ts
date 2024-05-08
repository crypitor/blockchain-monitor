import {
  Body,
  Controller,
  HttpCode,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { User } from '../users/schemas/user.schema';
import { AuthService } from './auth.service';
import { ActivateDto } from './dto/activate.dto';
import { LoginDto, LoginEmailDto, LoginWithTokenDto } from './dto/login.dto';
import {
  LoginEmailResponseDto,
  LoginResponseDto,
} from './dto/login.reponse.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({ summary: 'Login' })
  @UseGuards(LocalAuthGuard)
  @Post('login')
  @HttpCode(200)
  @ApiOkResponse({ type: LoginResponseDto })
  async login(
    @Req() req: Request,
    @Body() body: LoginDto,
  ): Promise<LoginResponseDto> {
    return this.authService.login(req.user as User);
  }

  @ApiOperation({ summary: 'Login Using Email only' })
  @Post('login-email')
  @HttpCode(200)
  @ApiOkResponse({ type: LoginEmailResponseDto })
  async loginWithEmail(
    @Req() req: Request,
    @Body() body: LoginEmailDto,
  ): Promise<LoginEmailResponseDto> {
    return this.authService.loginWithEmail(body);
  }

  @ApiOperation({ summary: 'Login Using Token' })
  @Post('login-token')
  @HttpCode(200)
  @ApiOkResponse({ type: LoginResponseDto })
  async loginWithToken(
    @Req() req: Request,
    @Body() body: LoginWithTokenDto,
  ): Promise<LoginResponseDto> {
    return this.authService.loginWithToken(body);
  }

  @ApiOperation({ summary: 'Activate account' })
  @Post('activate')
  @HttpCode(200)
  @ApiOkResponse({ type: LoginResponseDto })
  async activateAccount(
    @Req() req: Request,
    @Body() body: ActivateDto,
  ): Promise<LoginResponseDto> {
    return this.authService.activateAccount(body);
  }
}
