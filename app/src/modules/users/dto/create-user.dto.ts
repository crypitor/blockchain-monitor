import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsAlpha,
  MinLength,
  MaxLength,
  IsNotEmpty,
  IsEmail,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(30)
  @IsAlpha()
  firstName: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(30)
  @IsAlpha()
  lastName: string;

  @ApiProperty()
  @IsString()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(30)
  password: string;
}
