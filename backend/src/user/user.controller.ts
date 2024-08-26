import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    try {
      await this.userService.create(createUserDto);
      return {
        code: `OK`,
        msg: `유저 생성 완료!`,
      };
    } catch (err) {
      return {
        code: `ERR_USER_CREATE`,
        msg: `알 수 없는 에러가 발생했습니다.`,
      };
    }
  }

  @Get()
  async findAll() {
    try {
      const users = await this.userService.findAll();
      return {
        code: `OK`,
        msg: `모든 유저 목록`,
        data: users,
      };
    } catch (err) {
      return {
        code: `ERR_USER_FINDALL`,
        msg: `알 수 없는 에러가 발생했습니다.`,
      };
    }
  }

  // 유저 정보 임의로 볼 수 없게 일단 비활성화

  // @Get(':username')
  // async findOne(@Param('username') username: string) {
  //   try {
  //     const user = await this.userService.findOneByUsername(username);
  //     return {
  //       code: `OK`,
  //       msg: `${username} 유저 정보`,
  //       data: user,
  //     };
  //   } catch (err) {
  //     return {
  //       code: `ERR_USER_FINDONE`,
  //       msg: `알 수 없는 에러가 발생했습니다.`,
  //     };
  //   }
  // }

  @Patch(':username')
  update(@Param('username') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':username')
  remove(@Param('username') id: string) {
    return this.userService.remove(+id);
  }
}
