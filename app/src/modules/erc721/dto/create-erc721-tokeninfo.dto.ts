import {
  IsString,
  IsAlpha,
  MinLength,
  MaxLength,
  IsNotEmpty,
  IsEmail,
} from 'class-validator';

export class CreateERC721TokenInfoDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(42)
  token_address: string;

  @IsString()
  name: string;

  @IsString()
  symbol: string;
}
