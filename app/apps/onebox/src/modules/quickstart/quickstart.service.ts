import { ErrorCode } from '@app/global/global.error';
import { sendEmail } from '@app/utils/email.sender';
import { renderTemplate } from '@app/utils/file-template';
import { generateUUID } from '@app/utils/uuidUtils';
import { Inject, Injectable } from '@nestjs/common';
import { Builder } from 'builder-pattern';
import { Model } from 'mongoose';
import { MonitorAddressService } from '../address/address.service';
import { CreateMonitorAddressDto } from '../address/dto/address.dto';
import { AuthService } from '../auth/auth.service';
import { MonitorService } from '../monitor/monitor.service';
import { CreateProjectDto } from '../project/dto/project.dto';
import { ProjectService } from '../project/project.service';
import { User, UserStatus } from '../users/schemas/user.schema';
import { UsersService } from '../users/users.service';
import { QuickStartDto, QuickStartResponseDto } from './dto/quickstart.dto';

@Injectable()
export class QuickStartService {
  constructor(
    @Inject('USER_MODEL') private readonly userModel: Model<User>,
    private readonly userService: UsersService,
    private readonly projectService: ProjectService,
    private readonly monitorService: MonitorService,
    private readonly monitorAddressService: MonitorAddressService,
    private readonly authService: AuthService,
  ) {}

  async quickStart(request: QuickStartDto): Promise<QuickStartResponseDto> {
    const existedUser = await this.userModel.findOne({ email: request.email });
    if (existedUser) {
      throw ErrorCode.ACCOUNT_EXISTS.asException('Email already exists');
    }
    const userId = generateUUID();
    const user = await new this.userModel({
      email: request.email,
      userId: userId,
      dateCreated: new Date(),
      enableEmailUpdate: true,
      language: 'en',
      status: UserStatus.Pending,
    }).save();

    const project = await this.projectService.createProject(
      user,
      Builder<CreateProjectDto>().name('My Project').build(),
    );

    const createMonitor = request.monitor;
    createMonitor.projectId = project.projectId;
    createMonitor.disabled = true;
    const monitor = await this.monitorService.createMonitor(
      user,
      createMonitor,
    );

    const createAddress = {
      monitorId: monitor.monitorId,
      addresses: request.addresses,
    } as CreateMonitorAddressDto;
    await this.monitorAddressService.createMonitorAddress(user, createAddress);

    const activateToken = generateUUID();
    const tokenExpire = Date.now() + 365 * 24 * 60 * 60 * 1000; // 1 year
    await this.userModel.updateOne(
      { userId: user.userId },
      {
        emailActivation: {
          token: activateToken,
          expire: tokenExpire,
          monitorId: monitor.monitorId,
        },
      },
    );
    const encodedToken = Buffer.from(`${user.email}:${activateToken}`).toString(
      'base64',
    );
    const linkActivate = `https://${process.env.WEB_DOMAIN}/activate?token=${encodedToken}`;
    const emailBody = await renderTemplate(
      'resources/email_template/activate.html',
      {
        linkActivate: linkActivate,
      },
    );
    sendEmail(user.email, 'Account Activation', emailBody);
    return Builder<QuickStartResponseDto>().success(true).build();
  }
}
