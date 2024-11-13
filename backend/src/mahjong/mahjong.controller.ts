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
import { ApiCreatedResponse, ApiOkResponse } from '@nestjs/swagger';

@Controller('mahjong')
export class MahjongController {
  constructor(private readonly mahjongService: MahjongService) {}

  @UseGuards(JwtAccessTokenGuard, RoleGuard)
  @Roles(Role.MAHJONG_RECORD_ADMIN, Role.ADMIN)
  @Post('game')
  @ApiCreatedResponse({
    example: {
      id: 345,
    },
  })
  async createGame(@Body() createMahjongGameDto: CreateMahjongGameDto) {
    const res = await this.mahjongService.create(createMahjongGameDto);
    return { id: res.id };
  }

  @Get('game')
  @ApiOkResponse({
    example: [
      {
        id: 213,
        subcategory: '반장전',
        category: '4마',
        players: [
          {
            playerName: '김철수A',
            nickname: '김철수',
            seat: 0,
            rank: 3,
            score: 25000,
          },
          {
            playerName: '김영희A',
            nickname: '김영희',
            seat: 1,
            rank: 1,
            score: 37200,
          },
          {
            playerName: '홍길동A',
            nickname: '홍길동',
            seat: 2,
            rank: 4,
            score: 11000,
          },
          {
            playerName: '홍길순A',
            nickname: '홍길순',
            seat: 3,
            rank: 2,
            score: 26800,
          },
        ],
        note: null,
      },
    ],
  })
  async findAll(
    @Query('playername') playerName?: string,
    @Query('category') category?: MahjongCategory,
  ) {
    const res = await this.mahjongService.findAll(playerName, category);
    return res;
  }

  // @Get('game/:id')
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
  @Delete('game/:id')
  @ApiOkResponse()
  async deleteGame(@Param('id') id: number) {
    const res = await this.mahjongService.delete(id);
    return res;
  }

  @Get('/statistics/player')
  @ApiOkResponse()
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
