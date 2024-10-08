import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { MahjongService } from './mahjong.service';
import { JwtAccessTokenGuard } from 'src/auth/guard/accesstoken.guard';
import { CreateMahjongGameDto } from './dto/create.mahjong.dto';
import { RoleGuard, Roles } from 'src/auth/guard/role.guard';
import { Role } from 'src/user/entities/role.entity';
import { MahjongCategory } from './constants/mahjong.constant';

@Controller('mahjong')
export class MahjongController {
  constructor(private readonly mahjongService: MahjongService) {}

  @UseGuards(JwtAccessTokenGuard, RoleGuard)
  @Roles(Role.MAHJONG_RECORD_ADMIN, Role.ADMIN)
  @Post()
  async createGame(@Body() createMahjongGameDto: CreateMahjongGameDto) {
    const res = await this.mahjongService.create(createMahjongGameDto);
    return res;
  }

  @Get()
  async findAll(
    @Query('playername') playerName?: string,
    @Query('category') category?: MahjongCategory,
  ) {
    const res = await this.mahjongService.findAll(playerName, category);
    return res;
  }

  // @Get('/:id')
  // async findOneById(@Param('id') id: number) {
  //   try {
  //     const res = await this.mahjongService.findById(+id);
  //     return {
  //       code: `OK`,
  //       msg: `${id}번 마작 경기 상세`,
  //       data: res,
  //     };
  //   } catch (err) {
  //     const code =
  //       err instanceof Error ? err.message : `ERROR_MAHJONG_GAME_FINDONE`;
  //     return {
  //       code: code,
  //       msg: `알 수 없는 에러가 발생했습니다.`,
  //     };
  //   }
  // }

  // TODO: PATCH /:id
  // Needs 'Mahjong Record Admin' Role
  // Body: {east: {nickname, score}, south, west, north}
  // 우마는 cascade 필요 없으므로 그냥 계산하면 됨

  @UseGuards(JwtAccessTokenGuard, RoleGuard)
  @Roles(Role.MAHJONG_RECORD_ADMIN, Role.ADMIN)
  @Delete('/:id')
  async deleteGame(@Param('id') id: number) {
    const res = await this.mahjongService.delete(id);
    return res;
  }

  @Get('/statistics/player')
  async getAllStatistics(
    @Query('category') category?: MahjongCategory,
    @Query('playername') playerName?: string,
  ) {
    const res = await this.mahjongService.getPlayerStatistics(
      category,
      playerName,
    );
    return res;
  }
}
