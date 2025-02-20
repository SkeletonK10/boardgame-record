import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { MahjongPlayerService } from './player.service';
import { CreateMahjongPlayerDto } from './dto/create.player.dto';
import { JwtAccessTokenGuard } from 'src/auth/guard/accesstoken.guard';
import { RoleGuard, Roles } from 'src/auth/guard/role.guard';
import { Role } from 'src/user/entities/role.entity';
import { MahjongCategory } from '../constants/mahjong.constant';
import { ServiceException } from 'src/common/exception/exception';
import { ApiCreatedResponse, ApiOkResponse } from '@nestjs/swagger';
import { playerRankingExmample } from './constants/player.example';
import { getCurrentSeason, getSeasonPeriod } from 'src/common/utils';

@Controller('mahjong/player')
export class MahjongPlayerController {
  constructor(private readonly MahjongplayerService: MahjongPlayerService) {}

  @UseGuards(JwtAccessTokenGuard, RoleGuard)
  @Roles(Role.ADMIN, Role.MAHJONG_RECORD_ADMIN)
  @Post()
  @ApiCreatedResponse({
    description: 'Player successfuly created',
  })
  async create(@Body() createMahjongPlayerDto: CreateMahjongPlayerDto) {
    return await this.MahjongplayerService.create(createMahjongPlayerDto);
  }

  @UseGuards(JwtAccessTokenGuard, RoleGuard)
  @Roles(Role.ADMIN)
  @HttpCode(200)
  @Post('guest-count')
  @ApiOkResponse({
    description: 'Number of players using corresponding playerName',
    example: 3,
  })
  async countGuestCount(@Body('playerName') playerName: string) {
    return await this.MahjongplayerService.countGuestByPlayerName(playerName);
  }

  @Get()
  @ApiOkResponse({
    example: [
      {
        playerName: '홍길동A',
        nickname: '홍길동',
        rating: [
          { category: '4마', rating: 23.5 },
          { category: '3마', rating: -222.1 },
        ],
      },
    ],
  })
  async getAll() {
    const res = await this.MahjongplayerService.getAll();
    return res;
  }

  @Get('/:playername/info')
  @ApiOkResponse({
    example: {
      id: 223123,
      playerName: '홍길동A',
      nickname: '홍길동',
      createdAt: '2024-09-14T22:11:48.964Z',
      updatedAt: '2024-09-14T22:11:48.964Z',
    },
  })
  async findOne(@Param('playername') playerName: string) {
    const res = await this.MahjongplayerService.findOneByPlayerName(playerName);
    if (!res) throw new ServiceException('MAHJONG_GAME_PLAYER_DOES_NOT_EXISTS');
    return res;
  }

  @Get('ranking')
  @ApiOkResponse({ example: playerRankingExmample })
  async getRanking(
    @Query('category') category: MahjongCategory,
    @Query('startdate') startDate?: string, // ISO 8601 (YYYY-MM-DDThh:mm:ss.xxxZ)
    @Query('enddate') endDate?: string,
  ) {
    const res = await this.MahjongplayerService.getRanking(
      category,
      startDate,
      endDate,
    );
    return res;
  }

  @Get('ranking/season')
  @ApiOkResponse({ example: playerRankingExmample })
  async getSeasonRanking(
    @Query('category') category: MahjongCategory,
    @Query('season', new ParseIntPipe({ optional: true })) season?: number,
  ) {
    if (!season) season = getCurrentSeason();
    const { start, end } = getSeasonPeriod(season);
    const res = await this.MahjongplayerService.getRanking(
      category,
      start,
      end,
    );
    return res;
  }
}
