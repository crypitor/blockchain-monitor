import { User } from '../schemas/user.schema';

export class UserProfileDto {
  userId: string;
  email: string;
  name: string;
  country: string;
  dateCreated: Date;
  enableEmailUpdate: boolean;
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
