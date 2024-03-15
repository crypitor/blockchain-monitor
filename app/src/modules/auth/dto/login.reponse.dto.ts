export class LoginResponseDto {
  accessToken: string;
  constructor(accessToken: string) {
    this.accessToken = accessToken;
  }
}
