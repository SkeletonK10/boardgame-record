import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/user/entities/user.entity';
import { ConfigService } from '@nestjs/config';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { SignInDto } from './dto/signin.dto';
import { ServiceException } from 'src/common/exception/exception';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async signIn(signInDto: SignInDto) {
    const user = await this.compareSignInDto(signInDto);
    const access_token = this.getAccessToken(user);
    const refresh_token = await this.getRefreshToken(user);
    return { access_token, refresh_token };
  }

  async compareSignInDto(signInDto: SignInDto) {
    const user = await this.userService.findOneByUsername(signInDto.username);

    if (!user) {
      throw new ServiceException('AUTH_ID_DOES_NOT_EXIST');
    }

    if (!(await bcrypt.compare(signInDto.password, user.password))) {
      throw new ServiceException('AUTH_PASSWORD_DOES_NOT_MATCH');
    }

    return user;
  }

  getAccessToken(user: User) {
    return this.jwtService.sign(
      {
        username: user.username,
        nickname: user.nickname,
      },
      {
        secret: this.configService.get(`JWT_ACCESS_TOKEN_SECRET_KEY`),
        expiresIn: this.configService.get(`JWT_ACCESS_TOKEN_DURATION`),
      },
    );
  }

  async getRefreshToken(user: User) {
    const refresh = this.jwtService.sign(
      {
        username: user.username,
        nickname: user.nickname,
      },
      {
        secret: this.configService.get(`JWT_REFRESH_TOKEN_SECRET_KEY`),
        expiresIn: this.configService.get(`JWT_REFRESH_TOKEN_DURATION`),
      },
    );
    await this.updateUserRefreshToken(user, refresh);
    return refresh;
  }

  async updateUserRefreshToken(user: User, refresh_token: string) {
    const hashed_token = bcrypt.hashSync(refresh_token, 10);
    return await this.userService.update(user.username, {
      currentRefreshToken: hashed_token,
    });
  }

  async compareUserRefreshToken(username: string, token: string) {
    const user = await this.userService.findOneByUsername(username);
    if (!user.currentRefreshToken) {
      return false;
    }
    const res = await bcrypt.compare(token, user.currentRefreshToken);
    console.log(res);
    return res;
  }

  async refresh(refreshToken: string) {
    let decodedRefreshToken;
    try {
      decodedRefreshToken = this.jwtService.verify(refreshToken, {
        secret: this.configService.get(`JWT_REFRESH_TOKEN_SECRET_KEY`),
      });
    } catch {
      throw new ServiceException('AUTH_WRONG_REFRESH_TOKEN');
    }
    const comp = await this.compareUserRefreshToken(
      decodedRefreshToken.username,
      refreshToken,
    );
    if (!comp) throw new ServiceException('AUTH_EXPIRED_REFRESH_TOKEN');
    const user = await this.userService.findOneByUsername(
      decodedRefreshToken.username,
    );

    return this.getAccessToken(user);
  }
}
