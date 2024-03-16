import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { User } from 'src/modules/users/schemas/user.schema';
import { comparePassword, hashPassword } from 'src/utils/bcrypt.util';
import { generateUUID } from 'src/utils/uuidUtils';
import {
  ChangePasswordDto,
  ChangePasswordResponseDto,
} from './dto/change-password.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { hashMd5 } from 'src/utils/md5';

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
    const passwordHash = hashMd5(createUserDto.password);
    return new this.userModel({
      ...createUserDto,
      userId,
      passwordHash,
    }).save();
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

  /**
   * Change user password.
   * @param user user
   * @param changePasswordDto changePasswordDto
   * @returns {ChangePasswordResponseDto}
   */
  async changePassword(
    user: User,
    changePasswordDto: ChangePasswordDto,
  ): Promise<ChangePasswordResponseDto> {
    // check new password
    if (changePasswordDto.newPassword !== changePasswordDto.confirmPassword) {
      throw new BadRequestException(
        'New password and confirm password do not match',
      );
    }

    // check old password
    if (
      !(await comparePassword(changePasswordDto.oldPassword, user.password))
    ) {
      throw new BadRequestException('Wrong old password');
    }

    // update password
    user.password = await hashPassword(changePasswordDto.newPassword);
    user.passwordHash = hashMd5(user.password);
    await this.userModel.updateOne(
      { userId: user.userId },
      { password: user.password, passwordHash: user.passwordHash },
    );
    return new ChangePasswordResponseDto(true);
  }
}
