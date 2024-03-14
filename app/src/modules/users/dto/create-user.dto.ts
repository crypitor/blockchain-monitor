import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsAlpha,
  MinLength,
  MaxLength,
  IsNotEmpty,
  IsEmail,
  IsStrongPassword,
} from 'class-validator';

export class CreateUserDto {
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
  @IsStrongPassword({
    minLength: 8,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1,
  })
  password: string;

  @ApiProperty()
  @IsString()
  @IsAlpha()
  country: string;

  @ApiProperty()
  @IsString()
  @IsAlpha()
  name: string;

  @ApiProperty({
    default: false,
  })
  @IsNotEmpty()
  enableEmailUpdate: boolean;

  @ApiProperty({
    default: 'en',
  })
  @IsString()
  @IsAlpha()
  language: string;
}
