import {
  Controller,
  Post,
  Body,
  UsePipes,
  BadRequestException,
  UseGuards,
  Get,
  Req,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';
import { User, UserSchema } from '../users/schemas/user.schema';
import { Model } from 'mongoose';
import { CreateUserValidationPipe } from './users.pipe';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Request } from 'express';

@Controller('user')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post('/register')
  @UsePipes(new CreateUserValidationPipe())
  async register(@Body() user: CreateUserDto) {
    const result: InstanceType<typeof User> = await this.usersService.create(
      user,
    );
    const UserModel = Model<typeof UserSchema>;
    result.password = undefined;
    if (result instanceof UserModel) {
      return result;
    }
  }

  @ApiBearerAuth('JWT')
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Req() req: Request) {
    console.log(req);
    return req.user;
  }
}
