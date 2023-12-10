import {
  IsString,
  IsAlpha,
  MinLength,
  MaxLength,
  IsNotEmpty,
  IsEmail,
} from 'class-validator';

export class DeleteERC721TokenInfoDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(42)
  @IsAlpha()
  token_address: string;
}
