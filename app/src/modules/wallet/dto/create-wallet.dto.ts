import { ApiBody, ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsAlpha,
  MaxLength,
  IsNotEmpty,
  IsLowercase,
} from 'class-validator';

export class CreateWalletWebhookDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MaxLength(42)
  address: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  webhookUrl: string;
}
