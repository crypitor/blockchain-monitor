import { Inject, Injectable, Logger } from '@nestjs/common';
import { Model } from 'mongoose';

import { ErrorCode } from '@app/global/global.error';
import { MonitorRepository } from '@app/shared_modules/monitor/repositories/monitor.repository';
import { comparePassword, hashPassword } from '@app/utils/bcrypt.util';
import { sendEmail } from '@app/utils/email.sender';
import { renderTemplate } from '@app/utils/file-template';
import { hashMd5 } from '@app/utils/md5';
import { generateUUID } from '@app/utils/uuidUtils';
import { Builder } from 'builder-pattern';
import { CreateProjectDto } from '../project/dto/project.dto';
import { ProjectService } from '../project/project.service';
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
import { User, UserStatus } from './schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(
    @Inject('USER_MODEL') private readonly userModel: Model<User>,
    private readonly projectService: ProjectService,
    private readonly monitorRepository: MonitorRepository,
  ) {}

  /**
   * Create new user.
   *
   * @param createUserDto The user to create.
   * @returns {User}
   */
  async create(createUserDto: CreateUserDto): Promise<User> {
    const existedUser = await this.findOne(createUserDto.email);
    if (existedUser) {
      throw ErrorCode.ACCOUNT_EXISTS.asException('Email already exists');
    }
    const userId = generateUUID();
    // store password as hash
    createUserDto.password = await hashPassword(createUserDto.password);
    const passwordHash = hashMd5(createUserDto.password);
    const user = await new this.userModel({
      ...createUserDto,
      userId,
      passwordHash,
      status: UserStatus.Active,
      dateCreated: new Date(),
    }).save();
    const linkLogin = `https://${process.env.WEB_DOMAIN}/sign-in`;
    const emailBody = await renderTemplate(
      'resources/email_template/welcome.html',
      {
        linkLogin,
      },
    );
    sendEmail(user.email, 'Welcome', emailBody);
    this.projectService
      .createProject(
        user,
        Builder<CreateProjectDto>().name('My Project').build(),
      )
      .then((project) => {
        Logger.log('Create project successfully: {}', project);
      });
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
      throw ErrorCode.PASSWORD_NOT_MATCH.asException(
        'New password and confirm password do not match',
      );
    }

    // check old password
    if (
      !(await comparePassword(changePasswordDto.oldPassword, user.password))
    ) {
      throw ErrorCode.WRONG_PASSWORD.asException('Wrong old password');
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
      throw ErrorCode.ACCOUNT_NOT_FOUND.asException('Email not found');
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
      'resources/email_template/forgot_password.html',
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
      throw ErrorCode.ACCOUNT_NOT_FOUND.asException();
    }
    if (
      !user.forgotPassword ||
      user.forgotPassword.token !== resetPasswordDto.token
    ) {
      throw ErrorCode.INVALID_TOKEN.asException();
    }
    if (user.forgotPassword.expire < Date.now()) {
      throw ErrorCode.INVALID_TOKEN.asException('Token expired');
    }
    if (resetPasswordDto.password !== resetPasswordDto.confirmPassword) {
      throw ErrorCode.PASSWORD_NOT_MATCH.asException(
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
    const linkLogin = `https://${process.env.WEB_DOMAIN}/sign-in`;
    const emailBody = await renderTemplate(
      'resources/email_template/reset_password_success.html',
      {
        linkLogin,
      },
    );
    sendEmail(user.email, 'Password Reset Successfully', emailBody);
    return new ResetPasswordResponseDto(true);
  }

  async activateAccount(token: string): Promise<User> {
    const decodedToken = Buffer.from(token, 'base64').toString();
    const [email, activateToken] = decodedToken.split(':');
    const user = await this.findOne(email);
    if (!user || !user.emailActivation) {
      throw ErrorCode.WRONG_EMAIL_OR_TOKEN.asException();
    }
    if (user.emailActivation.token !== activateToken) {
      throw ErrorCode.WRONG_EMAIL_OR_TOKEN.asException();
    }
    if (user.emailActivation.expire < Date.now()) {
      throw ErrorCode.WRONG_EMAIL_OR_TOKEN.asException();
    }
    const updatedUser = await this.userModel.findOneAndUpdate(
      { userId: user.userId },
      {
        $set: {
          status: UserStatus.Active,
        },
        $unset: { emailLogin: '' },
      },
      { new: true },
    );
    const updateMonitor = new Map<string, any>();
    updateMonitor['disabled'] = false;
    await this.monitorRepository.updateMonitor(
      user.emailActivation.monitorId,
      updateMonitor,
    );
    return updatedUser;
  }
}
