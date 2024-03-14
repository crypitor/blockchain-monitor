import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { User } from 'src/modules/users/schemas/user.schema';
import { hashPassword } from 'src/utils/bcrypt.util';
import { generateUUID } from 'src/utils/uuidUtils';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(@Inject('USER_MODEL') private readonly userModel: Model<User>) {}

  /**
   * Create new user.
   *
   * @param createUserDto The user to create.
   * @returns {User}
   */
  async create(createUserDto: CreateUserDto): Promise<User> {
    const existedUser = await this.findOne(createUserDto.email);
    if (existedUser) {
      throw new Error('User already exists');
    }
    const userId = generateUUID();
    // store password as hash
    createUserDto.password = await hashPassword(createUserDto.password);
    return new this.userModel({ ...createUserDto, userId }).save();
  }

  /**
   * Get all Users.
   *
   * @returns {User[]}
   */
  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  /**
   * Find a single user by their email.
   *
   * @param email The users email to filter by.
   * @returns {User}
   */
  async findOne(email: string): Promise<User | undefined> {
    return this.userModel.findOne({ email: email });
  }

  /**
   * Find a single user by their userId.
   *
   * @param userId The users userId to filter by.
   * @returns {User}
   */
  async findOneByUserId(userId: string): Promise<User | undefined> {
    return this.userModel.findOne({ userId: userId });
  }
}
