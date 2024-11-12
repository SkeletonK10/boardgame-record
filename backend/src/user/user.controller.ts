import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create.user.dto';
import { UpdateUserDto } from './dto/update.user.dto';
import { JwtAccessTokenGuard } from 'src/auth/guard/accesstoken.guard';
import { RoleGuard, Roles } from 'src/auth/guard/role.guard';
import { Role } from './entities/role.entity';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    const user = await this.userService.create(createUserDto);
    return {
      username: user.username,
      nickname: user.nickname,
    };
  }

  @UseGuards(JwtAccessTokenGuard, RoleGuard)
  @Roles(Role.ADMIN)
  @Get()
  async findAll() {
    const users = await this.userService.findAll();
    return users;
  }

  // 유저 정보 임의로 볼 수 없게 일단 비활성화

  // @Get(':username')
  // async findOne(@Param('username') username: string) {
  //   const user = await this.userService.findOneByUsername(username);
  //   return user;
  // }

  // @Patch(':username')
  // update(
  //   @Param('username') username: string,
  //   @Body() updateUserDto: UpdateUserDto,
  // ) {
  //   return this.userService.update(username, updateUserDto);
  // }

  // @Delete(':username')
  // remove(@Param('username') id: string) {
  //   return this.userService.remove(+id);
  // }
}
