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
import { JwtAccessTokenGuard } from 'src/auth/guard/access-token.guard';
import { CreateMahjongGameDto } from './dto/create-mahjong.dto';
import { RoleGuard, Roles } from 'src/auth/guard/role.guard';
import { Role } from 'src/user/entities/role.entity';
import { MahjongRatingCategory } from './enum/mahjong.enum';

@Controller('mahjong')
export class MahjongController {
  constructor(private readonly mahjongService: MahjongService) {}

  @UseGuards(JwtAccessTokenGuard, RoleGuard)
  @Roles(Role.mahjongRecordAdmin, Role.admin)
  @Post()
  async createGame(@Body() createMahjongGameDto: CreateMahjongGameDto) {
    try {
      const res = await this.mahjongService.create(createMahjongGameDto);
      return {
        code: `OK`,
        msg: `마작 경기 기록 완료!`,
        data: res,
      };
    } catch (err) {
      const code =
        err instanceof Error ? err.message : `ERROR_MAHJONG_GAME_CREATE`;
      return {
        code: code,
        msg: `알 수 없는 에러가 발생했습니다.`,
      };
    }
  }

  @Get()
  async findAll() {
    try {
      const res = await this.mahjongService.findAll();
      return {
        code: `OK`,
        msg: `모든 마작 경기`,
        data: res,
      };
    } catch (err) {
      const code =
        err instanceof Error ? err.message : `ERROR_MAHJONG_GAME_CREATE`;
      return {
        code: code,
        msg: `알 수 없는 에러가 발생했습니다.`,
      };
    }
  }

  // TODO: PATCH /:id
  // Needs 'Mahjong Record Admin' Role
  // Body: {east: {nickname, score}, south, west, north}
  // 우마는 cascade 필요 없으므로 그냥 계산하면 됨

  @UseGuards(JwtAccessTokenGuard, RoleGuard)
  @Roles(Role.mahjongRecordAdmin, Role.admin)
  @Delete(':id')
  async deleteGame(@Param('id') id: number) {
    try {
      const res = await this.mahjongService.delete(id);
      return {
        code: `OK`,
        msg: `마작 경기 삭제 완료!`,
      };
    } catch (err) {
      const code =
        err instanceof Error ? err.message : `ERROR_MAHJONG_GAME_CREATE`;
      return {
        code: code,
        msg: `알 수 없는 에러가 발생했습니다.`,
      };
    }
  }

  @Get('/statistics/player')
  async getAllStatistics(@Query('category') category?: MahjongRatingCategory) {
    try {
      const res = await this.mahjongService.getAllPlayerStatistics(category);
      return {
        code: `OK`,
        msg: `마작 플레이어 통계`,
        data: res,
      };
    } catch (err) {
      const code =
        err instanceof Error ? err.message : `ERROR_MAHJONG_PLAYERS_STATISTICS`;
      return {
        code: code,
        msg: `알 수 없는 에러가 발생했습니다.`,
      };
    }
  }
}
