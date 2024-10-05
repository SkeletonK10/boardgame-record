import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/signin.dto';
import { JwtAccessTokenGuard } from './guard/accesstoken.guard';
import { RoleGuard, Roles } from './guard/role.guard';
import { Role } from 'src/user/entities/role.entity';
import { UserService } from 'src/user/user.service';
import { RefreshDto } from './dto/refresh.dto';
import { UserRoleDto } from 'src/user/dto/user.role.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @UseGuards(JwtAccessTokenGuard)
  @Get()
  async test(@Req() req: any) {
    const user = await this.userService.findOneByUsername(req.user.username);
    return {
      username: user.username,
      nickname: user.nickname,
      roles: user.roles,
    };
  }

  // @UseGuards(JwtAccessTokenGuard, RoleGuard)
  // @Roles(Role.user)
  // @Get('/role/user')
  // async userRoleTest(@Req() req: any) {
  //   return req.user;
  // }

  // @UseGuards(JwtAccessTokenGuard, RoleGuard)
  // @Roles(Role.admin)
  // @Get('/role/admin')
  // async adminRoleTest(@Req() req: any) {
  //   return req.user;
  // }

  @UseGuards(JwtAccessTokenGuard, RoleGuard)
  @Roles(Role.ADMIN)
  @Get('/role')
  async getAllWithRoles() {
    const res = await this.userService.findAllWithRoles();
    return res;
  }

  @UseGuards(JwtAccessTokenGuard, RoleGuard)
  @Roles(Role.ADMIN)
  @Post('/role')
  async grantRole(@Body() grantRoleDto: UserRoleDto) {
    const { user, role } = await this.userService.grantRole(grantRoleDto);
  }

  @UseGuards(JwtAccessTokenGuard, RoleGuard)
  @Roles(Role.ADMIN)
  @Delete('/role')
  async depriveRole(@Query() depriveRoleDto: UserRoleDto) {
    const res = await this.userService.depriveRole(depriveRoleDto);
  }

  @HttpCode(200)
  @Post('signin')
  async signIn(@Body() signInDto: SignInDto) {
    const { access_token, refresh_token } =
      await this.authService.signIn(signInDto);
    return {
      access: access_token,
      refresh: refresh_token,
    };
  }

  @Post('refresh')
  async refresh(@Body() { refresh }: RefreshDto) {
    const newAccessToken = await this.authService.refresh(refresh);
    return { access: newAccessToken };
  }
}
