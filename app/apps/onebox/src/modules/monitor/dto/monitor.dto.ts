import {
  EmailNotification,
  Monitor,
  MonitorCondition,
  MonitorNetwork,
  MonitorNotification,
  MonitorNotificationMethod,
  SMSNotification,
  WebhookNotification,
} from '@app/shared_modules/monitor/schemas/monitor.schema';
import { generateMonitorId } from '@app/utils/uuidUtils';
import { ApiProperty, ApiResponseProperty } from '@nestjs/swagger';
import { Builder } from 'builder-pattern';
import { Type } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsUrl, ValidateNested } from 'class-validator';

export class MonitorConditionDto {
  @ApiProperty({ default: true })
  native: boolean;
  @ApiProperty({ default: true })
  internal: boolean;
  @ApiProperty({ default: true })
  erc721: boolean;
  @ApiProperty({ default: true })
  erc20: boolean;
  @ApiProperty({ default: false })
  specific: boolean;
  @ApiProperty()
  cryptos: {
    [key: string]: boolean;
  };
}

export abstract class NotificationDto {
  @ApiProperty({ type: MonitorNotificationMethod })
  method: MonitorNotificationMethod;

  abstract toMonitorNotification(): MonitorNotification;
}

export class WebhookNotificationDto extends NotificationDto {
  @ApiProperty()
  @IsUrl()
  @IsNotEmpty()
  url: string;

  @ApiProperty()
  authorization: string;

  toMonitorNotification(): MonitorNotification {
    return Builder<WebhookNotification>()
      .method(MonitorNotificationMethod.Webhook)
      .url(this.url)
      .authorization(this.authorization)
      .build();
  }
}

export class SMSNotificationDto extends NotificationDto {
  @ApiProperty()
  @IsNotEmpty()
  phone: string;

  toMonitorNotification(): MonitorNotification {
    return Builder<SMSNotification>()
      .method(MonitorNotificationMethod.SMS)
      .phone(this.phone)
      .build();
  }
}

export class EmailNotificationDto extends NotificationDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  toMonitorNotification(): MonitorNotification {
    return Builder<EmailNotification>()
      .method(MonitorNotificationMethod.Email)
      .email(this.email)
      .build();
  }
}

export class CreateMonitorDto {
  @ApiProperty()
  @IsNotEmpty()
  projectId: string;

  @ApiProperty({ enum: MonitorNetwork, example: MonitorNetwork.Ethereum })
  network: MonitorNetwork;

  @ApiProperty({
    example: {
      native: true,
      internal: true,
      erc721: true,
      erc20: true,
      specific: false,
      cryptos: [],
    },
  })
  @ValidateNested()
  condition: MonitorConditionDto;

  @ApiProperty({
    example: {
      method: MonitorNotificationMethod.Webhook,
      url: 'https://example.com',
      authorization: 'Basic dGVzdHVzZXJuYW1lOnRlc3RwYXNzd29yZA==',
      secretToken: '',
    },
  })
  @ValidateNested()
  @Type(() => NotificationDto, {
    keepDiscriminatorProperty: true,
    discriminator: {
      property: 'method',
      subTypes: [
        {
          name: MonitorNotificationMethod.Webhook,
          value: WebhookNotificationDto,
        },
        {
          name: MonitorNotificationMethod.SMS,
          value: SMSNotificationDto,
        },
        {
          name: MonitorNotificationMethod.Email,
          value: EmailNotificationDto,
        },
      ],
    },
  })
  notification:
    | NotificationDto
    | WebhookNotificationDto
    | SMSNotificationDto
    | EmailNotificationDto;

  @ApiProperty()
  @IsNotEmpty()
  note: string;

  @ApiProperty()
  tags: string[];

  toMonitor(createdBy: string): Monitor {
    return Builder<Monitor>()
      .projectId(this.projectId)
      .monitorId(generateMonitorId())
      .network(this.network)
      .condition(
        Builder<MonitorCondition>()
          .native(this.condition.native)
          .internal(this.condition.internal)
          .erc721(this.condition.erc721)
          .erc20(this.condition.erc20)
          .specific(this.condition.specific)
          .cryptos(this.condition.cryptos)
          .build(),
      )
      .notification(this.notification.toMonitorNotification())
      .note(this.note)
      .tags(this.tags)
      .createdBy(createdBy)
      .dateCreated(new Date())
      .build();
  }
}

export class MonitorResponseDto {
  @ApiResponseProperty()
  projectId: string;

  @ApiResponseProperty()
  monitorId: string;

  @ApiResponseProperty()
  network: MonitorNetwork;

  @ApiResponseProperty()
  condition: MonitorCondition;

  @ApiResponseProperty()
  notification: MonitorNotification;

  @ApiResponseProperty()
  note: string;

  @ApiResponseProperty()
  tags: string[];

  @ApiResponseProperty()
  dateCreated: Date;

  static from(monitor: Monitor) {
    return Builder<MonitorResponseDto>()
      .projectId(monitor.projectId)
      .monitorId(monitor.monitorId)
      .network(monitor.network)
      .condition(monitor.condition)
      .notification(monitor.notification)
      .note(monitor.note)
      .tags(monitor.tags)
      .dateCreated(monitor.dateCreated)
      .build();
  }
}

export class DeleteMonitorDto {
  @ApiProperty()
  @IsNotEmpty()
  monitorId: string;
}

export class DeleteMonitorResponseDto {
  @ApiResponseProperty()
  success: boolean;
}
