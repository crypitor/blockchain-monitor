import {
  IsString,
  IsAlpha,
  MaxLength,
  IsNotEmpty,
  IsLowercase,
} from 'class-validator';

export class CreateBlockSyncDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(42)
  @IsLowercase()
  rpcUrl: string;

  chain: string;

  @IsString()
  @IsNotEmpty()
  lastSync: number;
}
