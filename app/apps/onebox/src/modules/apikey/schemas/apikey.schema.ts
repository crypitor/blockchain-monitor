import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { User } from 'apps/onebox/src/modules/users/schemas/user.schema';
import { Builder } from 'builder-pattern';
import { HydratedDocument } from 'mongoose';

export enum ApiKeyStatus {
  ENABLE = 'ENABLE',
  DISABLE = 'DISABLE',
}

@Schema()
export class ApiKey {
  @Prop({ required: true, unique: true })
  apiKey: string;

  @Prop({ required: true, index: 1 })
  userId: string;

  @Prop({ required: true, index: 1 })
  projectId: string;

  @Prop()
  name: string;

  @Prop()
  description: string;

  @Prop()
  status: ApiKeyStatus;

  @Prop()
  dateCreated: Date;
}
export type ApiKeyDocument = HydratedDocument<ApiKey>;
export const ApiKeySchema = SchemaFactory.createForClass(ApiKey);

export class ApiKeyUser extends User {
  apiKey: string;
  projectId: string;

  static from(user: User, apiKey: ApiKey): ApiKeyUser {
    return Builder<ApiKeyUser>()
      .userId(user.userId)
      .email(user.email)
      .name(user.name)
      .country(user.country)
      .dateCreated(user.dateCreated)
      .enableEmailUpdate(user.enableEmailUpdate)
      .language(user.language)
      .status(user.status)
      .apiKey(apiKey.apiKey)
      .projectId(apiKey.projectId)
      .build();
  }
}
