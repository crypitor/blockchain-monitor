import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { User } from 'src/modules/users/schemas/user.schema';
import { comparePassword, hashPassword } from 'src/utils/bcrypt.util';
import { sendEmail } from 'src/utils/email.sender';
import { renderTemplate } from 'src/utils/file-template';
import { hashMd5 } from 'src/utils/md5';
import { generateUUID } from 'src/utils/uuidUtils';
import {
  ChangePasswordDto,
  ChangePasswordResponseDto,
} from './dto/change-password.dto';
import { CreateUserDto } from './dto/create-user.dto';
import {
  ForgotPasswordDto,
  ForgotPasswordResponseDto,
  ResetPasswordDto,
  ResetPasswordResponseDto,
} from './dto/forgot-password.dto';

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
    const user = await new this.userModel({
      ...createUserDto,
      userId,
      passwordHash,
    }).save();
    const linkLogin = `https://${process.env.WEB_DOMAIN}/login`;
    const emailBody = await renderTemplate(
      'src/resources/email_template/welcome.html',
      {
        linkLogin,
      },
    );
    sendEmail(user.email, 'Welcome', emailBody);
    return user;
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

  /**
   * Forgot password
   * @param forgotPasswordDto forgotPasswordDto
   * @returns {ForgotPasswordResponseDto}
   */
  async forgotPassword(
    forgotPasswordDto: ForgotPasswordDto,
  ): Promise<ForgotPasswordResponseDto> {
    const user = await this.findOne(forgotPasswordDto.email);
    if (!user) {
      throw new BadRequestException('User not found');
    }
    const forgotPasswordToken = generateUUID();
    const forgotPasswordExpire = Date.now() + 24 * 60 * 60 * 1000;
    await this.userModel.updateOne(
      { userId: user.userId },
      {
        forgotPassword: {
          token: forgotPasswordToken,
          expire: forgotPasswordExpire,
        },
      },
    );
    const linkResetPassword = `https://${process.env.WEB_DOMAIN}/reset-password?token=${forgotPasswordToken}&email=${user.email}`;
    const emailBody = await renderTemplate(
      'src/resources/email_template/forgot_password.html',
      {
        linkResetPassword,
        expire: new Date(forgotPasswordExpire).toUTCString(),
      },
    );
    sendEmail(user.email, 'Reset Password Request', emailBody);
    return new ForgotPasswordResponseDto(true);
  }

  /**
   * Reset password
   * @param resetPasswordDto resetPasswordDto
   * @returns {ResetPasswordResponseDto}
   */
  async resetPassword(
    resetPasswordDto: ResetPasswordDto,
  ): Promise<ResetPasswordResponseDto> {
    const user = await this.findOne(resetPasswordDto.email);
    if (!user) {
      throw new BadRequestException('User not found');
    }
    if (
      !user.forgotPassword ||
      user.forgotPassword.token !== resetPasswordDto.token
    ) {
      throw new BadRequestException('Invalid token');
    }
    if (user.forgotPassword.expire < Date.now()) {
      throw new BadRequestException('Token expired');
    }
    if (resetPasswordDto.password !== resetPasswordDto.confirmPassword) {
      throw new BadRequestException(
        'New password and confirm password do not match',
      );
    }
    user.password = await hashPassword(resetPasswordDto.password);
    user.passwordHash = hashMd5(user.password);
    await this.userModel.updateOne(
      { userId: user.userId },
      {
        password: user.password,
        passwordHash: user.passwordHash,
        forgotPassword: null,
      },
    );
    const linkLogin = `https://${process.env.WEB_DOMAIN}/login`;
    const emailBody = await renderTemplate(
      'src/resources/email_template/reset_password_success.html',
      {
        linkLogin,
      },
    );
    sendEmail(user.email, 'Password Reset Successfully', emailBody);
    return new ResetPasswordResponseDto(true);
  }
}
