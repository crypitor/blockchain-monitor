import { ErrorCode } from '@app/global/global.error';
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from '../../users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private usersService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET_KEY,
    });
  }

  async validate(payload: any) {
    const user = await this.usersService.findOneByUserId(payload.userId);
    if (!user) {
      throw ErrorCode.UNAUTHORIZED.asException();
    }
    if (user.passwordHash !== payload.token) {
      throw ErrorCode.UNAUTHORIZED.asException();
    }
    return user;
  }
}
