import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop({ required: true, unique: true })
  userId: string;

  @Prop({ required: true, unique: true, lowercase: true })
  email: string;

  @Prop()
  password: string;

  @Prop()
  passwordHash: string;

  @Prop()
  name: string;

  @Prop()
  country: string;

  @Prop({ default: Date.now() })
  dateCreated: Date;

  @Prop({ default: false })
  enableEmailUpdate: boolean;

  @Prop({ default: 'en' })
  language: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
