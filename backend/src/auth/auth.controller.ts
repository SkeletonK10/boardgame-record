import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/signin-dto';
import { JwtAccessTokenGuard } from './guard/access-token.guard';
import { JwtRefreshTokenGuard } from './guard/refresh-token.guard';
import { RoleGuard, Roles } from './guard/role.guard';
import { Role } from 'src/user/entities/role.entity';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(JwtAccessTokenGuard)
  @Get()
  async test(@Req() req: any) {
    return req.user;
  }

  @UseGuards(JwtAccessTokenGuard, RoleGuard)
  @Roles(Role.user)
  @Get('/role/user')
  async userRoleTest(@Req() req: any) {
    return req.user;
  }

  @UseGuards(JwtAccessTokenGuard, RoleGuard)
  @Roles(Role.admin)
  @Get('/role/admin')
  async adminRoleTest(@Req() req: any) {
    return req.user;
  }

  @Post('signin')
  async signIn(@Body() signInDto: SignInDto) {
    try {
      const { access_token, refresh_token } =
        await this.authService.signIn(signInDto);
      return {
        code: `OK`,
        msg: `로그인 완료!`,
        data: {
          access: access_token,
          refresh: refresh_token,
        },
      };
    } catch (err) {
      return {
        code: `ERR_AUTH_SIGNIN`,
        msg: `알 수 없는 에러가 발생했습니다.`,
      };
    }
  }

  @UseGuards(JwtRefreshTokenGuard)
  @Post('refresh')
  async refresh(@Req() req: any) {
    try {
      const refresh = req.cookies.refresh_token;
      const newAccessToken = await this.authService.refresh(refresh);
      return {
        code: `OK`,
        msg: `토큰 갱신 완료!`,
        data: {
          access: newAccessToken,
        },
      };
    } catch (err) {
      return {
        code: `ERR_AUTH_SIGNIN`,
        msg: `알 수 없는 에러가 발생했습니다.`,
      };
    }
  }
}
