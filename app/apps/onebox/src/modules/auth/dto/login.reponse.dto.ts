import { ApiResponseProperty } from '@nestjs/swagger';

export class LoginResponseDto {
  @ApiResponseProperty()
  accessToken: string;
  constructor(accessToken: string) {
    this.accessToken = accessToken;
  }
}

export class LoginEmailResponseDto {
  @ApiResponseProperty()
  success: boolean;
}
