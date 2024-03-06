import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class DeleteWalletDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  webhookId: string;
}
