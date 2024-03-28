import { IsLowercase, IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class DeleteBlockSyncDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(42)
  @IsLowercase()
  rpcUrl: string;
}
