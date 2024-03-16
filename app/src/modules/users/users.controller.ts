import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
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
import { UserProfileDto } from './dto/user-profile.dto';
import { CreateUserValidationPipe } from './users.pipe';
import { UsersService } from './users.service';
import {
  ForgotPasswordDto,
  ForgotPasswordResponseDto,
  ResetPasswordDto,
  ResetPasswordResponseDto,
} from './dto/forgot-password.dto';

@ApiTags('User')
@Controller('user')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post('/register')
  @UsePipes(new CreateUserValidationPipe())
  @ApiCreatedResponse({ type: UserProfileDto })
  async register(@Body() user: CreateUserDto): Promise<UserProfileDto> {
    const result: InstanceType<typeof User> = await this.usersService.create(
      user,
    );
    return UserProfileDto.from(result);
  }

  @ApiBearerAuth('JWT')
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  @ApiOkResponse({ type: UserProfileDto })
  async getProfile(@Req() req: Request): Promise<UserProfileDto> {
    console.log(req);
    return UserProfileDto.from(req.user as User);
  }

  @ApiBearerAuth('JWT')
  @UseGuards(JwtAuthGuard)
  @Post('change-password')
  @ApiCreatedResponse({ type: ChangePasswordResponseDto })
  async changePassword(
    @Req() req: Request,
    @Body() changePasswordDto: ChangePasswordDto,
  ): Promise<ChangePasswordResponseDto> {
    return this.usersService.changePassword(
      req.user as User,
      changePasswordDto,
    );
  }

  @Post('forgot-password')
  @ApiCreatedResponse({ type: ForgotPasswordResponseDto })
  async forgotPassword(
    @Body() forgotPasswordDto: ForgotPasswordDto,
  ): Promise<ForgotPasswordResponseDto> {
    return this.usersService.forgotPassword(forgotPasswordDto);
  }

  @Post('reset-password')
  @ApiCreatedResponse({ type: ResetPasswordResponseDto })
  async resetPassword(
    @Body() resetPasswordDto: ResetPasswordDto,
  ): Promise<ResetPasswordResponseDto> {
    return this.usersService.resetPassword(resetPasswordDto);
  }
}
