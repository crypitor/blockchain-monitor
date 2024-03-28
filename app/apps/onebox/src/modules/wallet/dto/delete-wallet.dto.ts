import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsAlpha,
  MinLength,
  MaxLength,
  IsNotEmpty,
  IsLowercase,
} from 'class-validator';

export class DeleteWalletDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(42)
  @IsLowercase()
  @IsAlpha()
  address: string;
}
