import {
  IsString,
  IsAlpha,
  MaxLength,
  IsNotEmpty,
  IsLowercase,
} from 'class-validator';

export class CreateWalletWebhookDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(42)
  @IsLowercase()
  @IsAlpha()
  address: string;

  @IsString()
  @IsNotEmpty()
  webhookUrl: string;
}
