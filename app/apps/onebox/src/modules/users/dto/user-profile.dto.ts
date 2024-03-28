import { ApiResponseProperty } from '@nestjs/swagger';
import { User } from '../schemas/user.schema';

export class UserProfileDto {
  @ApiResponseProperty()
  userId: string;
  @ApiResponseProperty()
  email: string;
  @ApiResponseProperty()
  name: string;
  @ApiResponseProperty()
  country: string;
  @ApiResponseProperty()
  dateCreated: Date;
  @ApiResponseProperty()
  enableEmailUpdate: boolean;
  @ApiResponseProperty()
  language: string;

  static from(user: User) {
    return new UserProfileDto(user);
  }

  constructor(user: User) {
    this.userId = user.userId;
    this.email = user.email;
    this.name = user.name;
    this.country = user.country;
    this.dateCreated = user.dateCreated;
    this.enableEmailUpdate = user.enableEmailUpdate;
    this.language = user.language;
  }
}
