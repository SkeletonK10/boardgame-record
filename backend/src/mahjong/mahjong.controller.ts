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
import { MahjongCategory } from './enum/mahjong.enum';

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
  async findAll(
    @Query('playername') playerName?: string,
    @Query('category') category?: MahjongCategory,
  ) {
    try {
      const res = await this.mahjongService.findAll(playerName, category);
      return {
        code: `OK`,
        msg: `마작 경기 일람 - 플레이어: ${playerName || '전체'}, 카테고리: ${category || '전체'}`,
        data: res,
      };
    } catch (err) {
      const code =
        err instanceof Error ? err.message : `ERROR_MAHJONG_GAME_FINDALL`;
      return {
        code: code,
        msg: `알 수 없는 에러가 발생했습니다.`,
      };
    }
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
  @Roles(Role.mahjongRecordAdmin, Role.admin)
  @Delete('/:id')
  async deleteGame(@Param('id') id: number) {
    try {
      const res = await this.mahjongService.delete(id);
      return {
        code: `OK`,
        msg: `마작 경기 삭제 완료!`,
      };
    } catch (err) {
      const code =
        err instanceof Error ? err.message : `ERROR_MAHJONG_GAME_DELETE`;
      return {
        code: code,
        msg: `알 수 없는 에러가 발생했습니다.`,
      };
    }
  }

  @Get('/statistics/player')
  async getAllStatistics(
    @Query('category') category?: MahjongCategory,
    @Query('playername') playerName?: string,
  ) {
    try {
      const res = await this.mahjongService.getPlayerStatistics(
        category,
        playerName,
      );
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
