import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  UseGuards,
  UsePipes,
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
import {
  ChangePasswordDto,
  ChangePasswordResponseDto,
} from './dto/change-password.dto';
import { CreateUserDto } from './dto/create-user.dto';
import {
  ForgotPasswordDto,
  ForgotPasswordResponseDto,
  ResetPasswordDto,
  ResetPasswordResponseDto,
} from './dto/forgot-password.dto';
import { UserProfileDto } from './dto/user-profile.dto';
import { CreateUserValidationPipe } from './users.pipe';
import { UsersService } from './users.service';

@ApiTags('User')
@Controller('user')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @ApiOperation({ summary: 'Register new account' })
  @Post('/register')
  @UsePipes(new CreateUserValidationPipe())
  @ApiCreatedResponse({ type: UserProfileDto })
  async register(@Body() user: CreateUserDto): Promise<UserProfileDto> {
    const result: InstanceType<typeof User> = await this.usersService.create(
      user,
    );
    return UserProfileDto.from(result);
  }

  @ApiOperation({ summary: 'Get user profile' })
  @ApiBearerAuth('JWT')
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  @ApiOkResponse({ type: UserProfileDto })
  async getProfile(@Req() req: Request): Promise<UserProfileDto> {
    return UserProfileDto.from(req.user as User);
  }

  @ApiOperation({ summary: 'Change user password' })
  @ApiBearerAuth('JWT')
  @UseGuards(JwtAuthGuard)
  @Post('change-password')
  @HttpCode(200)
  @ApiOkResponse({ type: ChangePasswordResponseDto })
  async changePassword(
    @Req() req: Request,
    @Body() changePasswordDto: ChangePasswordDto,
  ): Promise<ChangePasswordResponseDto> {
    return this.usersService.changePassword(
      req.user as User,
      changePasswordDto,
    );
  }

  @ApiOperation({ summary: 'Forgot password' })
  @Post('forgot-password')
  @HttpCode(200)
  @ApiOkResponse({ type: ForgotPasswordResponseDto })
  async forgotPassword(
    @Body() forgotPasswordDto: ForgotPasswordDto,
  ): Promise<ForgotPasswordResponseDto> {
    return this.usersService.forgotPassword(forgotPasswordDto);
  }

  @ApiOperation({ summary: 'Reset password' })
  @Post('reset-password')
  @HttpCode(200)
  @ApiOkResponse({ type: ResetPasswordResponseDto })
  async resetPassword(
    @Body() resetPasswordDto: ResetPasswordDto,
  ): Promise<ResetPasswordResponseDto> {
    return this.usersService.resetPassword(resetPasswordDto);
  }
}
