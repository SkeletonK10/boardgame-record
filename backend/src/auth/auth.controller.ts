import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/signin-dto';
import { UserService } from 'src/user/user.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

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
}
