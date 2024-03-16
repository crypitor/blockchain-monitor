import { ApiProperty, ApiResponseProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsStrongPassword,
  MaxLength,
  MinLength,
} from 'class-validator';

export class ChangePasswordDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  oldPassword: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @MaxLength(30)
  @IsStrongPassword({
    minLength: 8,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1,
  })
  newPassword: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  confirmPassword: string;
}

export class ChangePasswordResponseDto {
  @ApiResponseProperty()
  success: boolean;
  constructor(success: boolean) {
    this.success = success;
  }
}
