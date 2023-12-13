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
  address: string;

  @IsString()
  @IsNotEmpty()
  webhookUrl: string;
}
