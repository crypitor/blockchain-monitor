import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class DeleteMonitorDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  monitorId: string;
}
