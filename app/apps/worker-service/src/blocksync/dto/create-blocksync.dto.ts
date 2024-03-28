import { IsLowercase, IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateBlockSyncDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(42)
  @IsLowercase()
  rpcUrl: string;

  @IsString()
  @IsNotEmpty()
  lastSync: number;
}
