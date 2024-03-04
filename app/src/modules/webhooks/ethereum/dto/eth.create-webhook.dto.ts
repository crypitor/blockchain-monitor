import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateEthWebhookDto {
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
