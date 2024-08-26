import { Injectable } from '@nestjs/common';
import { SignInDto } from './dto/signin-dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { User } from 'src/user/entities/user.entity';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    private readonly configService: ConfigService,
  ) {}

  getAccessToken(user: User) {
    return this.jwtService.sign(
      {
        username: user.username,
        nickname: user.nickname,
      },
      {
        secret: this.configService.get(`JWT_ACCESS_TOKEN_SECRET_KEY`),
        expiresIn: '5m',
      },
    );
  }

  async signIn(signInDto: SignInDto) {
    const user = await this.userService.findOneByUsername(signInDto.username);

    if (!user) {
      return {
        code: `AUTH_ID_DOES_NOT_EXIST`,
        msg: `존재하지 않는 아이디입니다.`,
      };
    }

    if (!(await bcrypt.compare(signInDto.password, user.password))) {
      return {
        code: `AUTH_PASSWORD_DOES_NOT_MATCH`,
        msg: `비밀번호가 일치하지 않습니다.`,
      };
    }

    return {
      code: `OK`,
      msg: `로그인 완료!`,
      data: this.getAccessToken(user),
    };
  }
}
