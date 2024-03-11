import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { User } from 'src/modules/users/schemas/user.schema';
import { hashPassword } from 'src/utils/bcrypt.util';
import { generateUUID } from 'src/utils/uuidUtils';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(@Inject('USER_MODEL') private readonly userModel: Model<User>) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const userId = generateUUID();
    // store password as hash
    createUserDto.password = await hashPassword(createUserDto.password);
    const createdUser = new this.userModel({ ...createUserDto, userId });
    try {
      return await createdUser.save();
    } catch (error) {
      throw error;
    }
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
}
