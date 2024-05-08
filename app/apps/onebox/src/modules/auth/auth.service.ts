import { ErrorCode } from '@app/global/global.error';
import { comparePassword } from '@app/utils/bcrypt.util';
import { sendEmail } from '@app/utils/email.sender';
import { renderTemplate } from '@app/utils/file-template';
import { generateUUID } from '@app/utils/uuidUtils';
import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Builder } from 'builder-pattern';
import { Model } from 'mongoose';
import { User, UserStatus } from '../users/schemas/user.schema';
import { UsersService } from '../users/users.service';
import { ActivateDto } from './dto/activate.dto';
import { LoginEmailDto, LoginWithTokenDto } from './dto/login.dto';
import {
  LoginEmailResponseDto,
  LoginResponseDto,
} from './dto/login.reponse.dto';

@Injectable()
export class AuthService {
  constructor(
    @Inject('USER_MODEL') private readonly userModel: Model<User>,
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<User> {
    const user = await this.usersService.findOne(email);
    if (!user || !user.password) {
      throw ErrorCode.WRONG_EMAIL_OR_PASSWORD.asException();
    }
    if (!(await comparePassword(pass, user.password))) {
      throw ErrorCode.WRONG_EMAIL_OR_PASSWORD.asException();
    }
    if (user.status && user.status !== UserStatus.Active) {
      throw ErrorCode.ACCOUNT_NOT_ACTIVE.asException();
    }
    return user;
  }

  async login(user: User): Promise<LoginResponseDto> {
    const payload = {
      userId: user.userId,
      email: user.email,
      token: user.passwordHash,
    };
    return new LoginResponseDto(this.jwtService.sign(payload));
  }

  async loginWithEmail(request: LoginEmailDto): Promise<LoginEmailResponseDto> {
    const user = await this.usersService.findOne(request.email.toLowerCase());
    if (!user) {
      throw ErrorCode.ACCOUNT_NOT_FOUND.asException();
    }

    if (user.status && user.status !== UserStatus.Active) {
      throw ErrorCode.ACCOUNT_NOT_ACTIVE.asException();
    }

    const loginToken = generateUUID();
    const tokenExpire = Date.now() + 5 * 60 * 1000; // 5 minutes
    await this.userModel.updateOne(
      { userId: user.userId },
      {
        emailLogin: {
          token: loginToken,
          expire: tokenExpire,
        },
      },
    );
    const encodedToken = Buffer.from(`${user.email}:${loginToken}`).toString(
      'base64',
    );
    const linkEmailLogin = `https://${process.env.WEB_DOMAIN}/token-login?token=${encodedToken}`;
    const emailBody = await renderTemplate(
      'resources/email_template/token_login.html',
      {
        linkEmailLogin,
        expire: new Date(tokenExpire).toUTCString(),
      },
    );
    sendEmail(user.email, 'Login Confirmation', emailBody);
    return Builder<LoginEmailResponseDto>().success(true).build();
  }

  async loginWithToken(request: LoginWithTokenDto): Promise<LoginResponseDto> {
    const decodedToken = Buffer.from(request.token, 'base64').toString();
    const [email, loginToken] = decodedToken.split(':');
    const user = await this.usersService.findOne(email);
    if (!user || !user.emailLogin) {
      throw ErrorCode.WRONG_EMAIL_OR_TOKEN.asException();
    }
    if (user.emailLogin.token !== loginToken) {
      throw ErrorCode.WRONG_EMAIL_OR_TOKEN.asException();
    }
    if (user.emailLogin.expire < Date.now()) {
      throw ErrorCode.WRONG_EMAIL_OR_TOKEN.asException();
    }
    await this.userModel.updateOne(
      { userId: user.userId },
      {
        $unset: { emailLogin: '' },
      },
    );
    return this.login(user);
  }

  async activateAccount(request: ActivateDto): Promise<LoginResponseDto> {
    const user = await this.usersService.activateAccount(request.token);
    return this.login(user);
  }
}
