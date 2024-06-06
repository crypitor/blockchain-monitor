import { ApiProperty, ApiResponseProperty } from '@nestjs/swagger';
import { CreateMonitorDto } from 'libs/shared_modules/src/monitor/dto/monitor.dto';
import { Type } from 'class-transformer';

export class QuickStartDto {
  @ApiProperty()
  email: string;

  @ApiProperty()
  @Type(() => CreateMonitorDto)
  monitor: CreateMonitorDto;

  @ApiProperty()
  addresses: string[];
}

export class QuickStartResponseDto {
  @ApiResponseProperty()
  success: boolean;
}
