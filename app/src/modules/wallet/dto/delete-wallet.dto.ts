import {
  IsString,
  IsAlpha,
  MinLength,
  MaxLength,
  IsNotEmpty,
  IsLowercase,
} from 'class-validator';

export class DeleteWalletDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(42)
  @IsLowercase()
  @IsAlpha()
  address: string;
}
