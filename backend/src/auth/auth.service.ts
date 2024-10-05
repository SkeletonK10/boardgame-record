import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/user/entities/user.entity';
import { ConfigService } from '@nestjs/config';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { SignInDto } from './dto/signin.dto';

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
    const refresh_token = this.getRefreshToken(user);

    this.updateUserRefreshToken(user, refresh_token);
    return { access_token, refresh_token };
  }

  async compareSignInDto(signInDto: SignInDto) {
    const user = await this.userService.findOneByUsername(signInDto.username);

    if (!user) {
      throw new UnauthorizedException(`AUTH_ID_DOES_NOT_EXIST`);
    }

    if (!(await bcrypt.compare(signInDto.password, user.password))) {
      throw new UnauthorizedException(`AUTH_PASSWORD_DOES_NOT_MATCH`);
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

  getRefreshToken(user: User) {
    return this.jwtService.sign(
      {
        username: user.username,
        nickname: user.nickname,
      },
      {
        secret: this.configService.get(`JWT_REFRESH_TOKEN_SECRET_KEY`),
        expiresIn: this.configService.get(`JWT_REFRESH_TOKEN_DURATION`),
      },
    );
  }

  updateUserRefreshToken(user: User, refresh_token: string) {
    const hashed_token = bcrypt.hashSync(refresh_token, 10);
    this.userService.update(user.username, {
      currentRefreshToken: hashed_token,
    });
  }

  async compareUserRefreshToken(username: string, token: string) {
    const user = await this.userService.findOneByUsername(username);
    if (!user.currentRefreshToken) {
      return false;
    }
    if (!bcrypt.compare(token, user.currentRefreshToken)) {
      return false;
    }
    return true;
  }

  async refresh(refreshToken: string) {
    const decodedRefreshToken = this.jwtService.verify(refreshToken, {
      secret: this.configService.get(`JWT_REFRESH_TOKEN_SECRET_KEY`),
    });
    const comp = await this.compareUserRefreshToken(
      decodedRefreshToken.username,
      refreshToken,
    );
    if (!comp) throw new UnauthorizedException(`AUTH_WRONG_REFRESH_TOKEN`);
    const user = await this.userService.findOneByUsername(
      decodedRefreshToken.username,
    );

    return this.getAccessToken(user);
  }
}
