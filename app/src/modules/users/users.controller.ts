import {
  Controller,
  Post,
  Body,
  UsePipes,
  UseGuards,
  Get,
  Req,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';
import { User } from '../users/schemas/user.schema';
import { CreateUserValidationPipe } from './users.pipe';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { UserProfileDto } from './dto/user-profile.dto';

@ApiTags('User')
@Controller('user')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post('/register')
  @UsePipes(new CreateUserValidationPipe())
  async register(@Body() user: CreateUserDto) {
    const result: InstanceType<typeof User> = await this.usersService.create(
      user,
    );
    return UserProfileDto.from(result);
  }

  @ApiBearerAuth('JWT')
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Req() req: Request) {
    console.log(req);
    return UserProfileDto.from(req.user as User);
  }
}
