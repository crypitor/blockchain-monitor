import {
  EmailNotification,
  Monitor,
  MonitorCondition,
  MonitoringType,
  MonitorNetwork,
  MonitorNotification,
  MonitorNotificationMethod,
  SMSNotification,
  WebhookNotification,
} from '../';
import { generateMonitorId } from '../../../../utils/src';
import { ApiProperty, ApiResponseProperty } from '@nestjs/swagger';
import { Builder } from 'builder-pattern';
import { Transform, Type } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsUrl,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';

export const DEFAULT_PROJECT_ID = 'DefaultProject';
export const DEFAULT_USER_ID = 'DefaultUser';

export class MonitorConditionDto {
  @ApiProperty({ default: true })
  native: boolean;
  @ApiProperty({ default: false })
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
  @IsNotEmpty()
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
  @ApiProperty({ default: DEFAULT_PROJECT_ID, example: DEFAULT_PROJECT_ID })
  @IsNotEmpty()
  projectId: string;

  @ApiProperty({ enum: MonitorNetwork, example: MonitorNetwork.Ethereum })
  network: MonitorNetwork;

  @ApiProperty({
    example: {
      native: true,
      internal: false,
      erc721: true,
      erc20: true,
      specific: false,
      cryptos: {
        '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174': true,
      },
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
  @IsNotEmpty()
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

  @ApiProperty({ example: 'all' })
  type: MonitoringType;

  @ApiProperty()
  note: string;

  @ApiProperty()
  tags: string[];

  @ApiProperty()
  @IsNotEmpty()
  name: string;

  disabled: boolean;

  toMonitor(createdBy: string): Monitor {
    return Builder<Monitor>()
      .projectId(this.projectId)
      .monitorId(generateMonitorId())
      .network(this.network)
      .name(this.name)
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
      .type(this.type)
      .note(this.note)
      .tags(this.tags)
      .createdBy(createdBy)
      .dateCreated(new Date())
      .disabled(this.disabled || false)
      .addressCount(0)
      .webhookCount(0)
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
  name: string;

  @ApiResponseProperty()
  condition: MonitorCondition;

  @ApiResponseProperty()
  notification: MonitorNotification;

  @ApiResponseProperty()
  note: string;

  @ApiResponseProperty()
  type: MonitoringType;

  @ApiResponseProperty()
  tags: string[];

  @ApiResponseProperty()
  dateCreated: Date;

  @ApiResponseProperty()
  disabled: boolean;

  @ApiResponseProperty()
  addressCount: number;

  @ApiResponseProperty()
  webhookCount: number;

  static from(monitor: Monitor) {
    return Builder<MonitorResponseDto>()
      .projectId(monitor.projectId)
      .monitorId(monitor.monitorId)
      .network(monitor.network)
      .name(monitor.name)
      .condition(monitor.condition)
      .notification(monitor.notification)
      .type(monitor.type)
      .note(monitor.note)
      .tags(monitor.tags)
      .dateCreated(monitor.dateCreated)
      .disabled(monitor.disabled || false)
      .addressCount(monitor.addressCount)
      .webhookCount(monitor.webhookCount)
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

export class UpdateMonitorDto {
  monitorId: string;

  @ApiProperty()
  name: string;

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

  @ApiProperty({ example: 'all' })
  type: MonitoringType;

  @ApiProperty()
  note: string;

  @ApiProperty()
  tags: string[];

  @ApiProperty()
  disabled: boolean;
}

export class ListMonitorDto {
  @ApiProperty({ default: DEFAULT_PROJECT_ID })
  @IsNotEmpty()
  projectId: string;

  @ApiProperty({ default: 10 })
  @IsNumber()
  @Max(10)
  @Min(1)
  @Transform(({ value }) => Number.parseInt(value))
  limit: number;

  @ApiProperty({ default: 0 })
  @IsNumber()
  @Min(0)
  @Transform(({ value }) => Number.parseInt(value))
  offset: number;

  @ApiProperty({ enum: MonitorNetwork, required: false })
  network: MonitorNetwork;

  @ApiProperty({ required: false })
  search: string;
}
