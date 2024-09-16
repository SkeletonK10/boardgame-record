import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { MahjongPlayerService } from './player.service';
import { CreateMahjongPlayerDto } from './dto/create-mahjong.dto';
import { JwtAccessTokenGuard } from 'src/auth/guard/access-token.guard';
import { RoleGuard, Roles } from 'src/auth/guard/role.guard';
import { Role } from 'src/user/entities/role.entity';
import { MahjongCategory } from '../enum/mahjong.enum';

@Controller('mahjong/player')
export class MahjongPlayerController {
  constructor(private readonly MahjongplayerService: MahjongPlayerService) {}

  @UseGuards(JwtAccessTokenGuard, RoleGuard)
  @Roles(Role.admin)
  @Post()
  async create(@Body() createMahjongPlayerDto: CreateMahjongPlayerDto) {
    return await this.MahjongplayerService.create(createMahjongPlayerDto);
  }

  @UseGuards(JwtAccessTokenGuard, RoleGuard)
  @Roles(Role.admin)
  @Post('guest-count')
  async countGuestCount(@Body() body: any) {
    return await this.MahjongplayerService.countGuestByPlayerName(
      body.playerName,
    );
  }

  @Get()
  async getAll() {
    try {
      const res = await this.MahjongplayerService.getAll();
      return {
        code: `OK`,
        msg: `모든 마작 플레이어`,
        data: res,
      };
    } catch (err) {
      const code =
        err instanceof Error ? err.message : `ERROR_MAHJONG_PLAYER_RANKING`;
      return {
        code: code,
        msg: `알 수 없는 에러가 발생했습니다.`,
      };
    }
  }

  @Get('ranking/:category')
  async getRanking(@Param('category') category: MahjongCategory) {
    try {
      const res = await this.MahjongplayerService.getRanking(category);
      return {
        code: `OK`,
        msg: `마작 ${category} 우마 랭킹`,
        data: res,
      };
    } catch (err) {
      const code =
        err instanceof Error ? err.message : `ERROR_MAHJONG_PLAYER_RANKING`;
      return {
        code: code,
        msg: `알 수 없는 에러가 발생했습니다.`,
      };
    }
  }
}
