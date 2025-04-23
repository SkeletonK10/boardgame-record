import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse } from '@nestjs/swagger';
import { JwtAccessTokenGuard } from 'src/auth/guard/accesstoken.guard';
import { RoleGuard, Roles } from 'src/auth/guard/role.guard';
import { ServiceException } from 'src/common/exception/exception';
import { Role } from 'src/user/entities/role.entity';
import { MahjongOptionDto } from '../dto/option.mahjong.dto';
import { MahjongService } from '../mahjong.service';
import { playerRankingExmample } from './constants/player.example';
import { CreateMahjongPlayerDto } from './dto/create.player.dto';
import { MahjongPlayerService } from './player.service';

@Controller('mahjong/player')
export class MahjongPlayerController {
  constructor(
    private readonly mahjongService: MahjongService,
    private readonly mahjongplayerService: MahjongPlayerService,
  ) {}

  @UseGuards(JwtAccessTokenGuard, RoleGuard)
  @Roles(Role.ADMIN, Role.MAHJONG_RECORD_ADMIN)
  @Post()
  @ApiCreatedResponse({
    description: 'Player successfuly created',
  })
  async create(@Body() createMahjongPlayerDto: CreateMahjongPlayerDto) {
    return await this.mahjongplayerService.create(createMahjongPlayerDto);
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
    return await this.mahjongplayerService.countGuestByPlayerName(playerName);
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
    const res = await this.mahjongplayerService.getAll();
    return res;
  }

  @Get('/:playerName/info')
  @ApiOkResponse({
    example: {
      id: 223123,
      playerName: '홍길동A',
      nickname: '홍길동',
      createdAt: '2024-09-14T22:11:48.964Z',
      updatedAt: '2024-09-14T22:11:48.964Z',
    },
  })
  async findOne(@Param('playerName') playerName: string) {
    const res = await this.mahjongplayerService.findOneByPlayerName(playerName);
    if (!res) throw new ServiceException('MAHJONG_GAME_PLAYER_DOES_NOT_EXISTS');
    return res;
  }

  @Get('ranking')
  @ApiOkResponse({ example: playerRankingExmample })
  async getRanking(
    @Query() { startDate, endDate, season, category }: MahjongOptionDto,
  ) {
    category = category ?? '4마';
    if (season) {
      const { startDate: start, endDate: end } =
        await this.mahjongService.getSeasonPeriod(season);
      startDate = start;
      endDate = end;
    } else if (!startDate && !endDate) {
      const { startDate: start, endDate: end } =
        await this.mahjongService.getSeasonPeriod();
      startDate = start;
      endDate = end;
    }
    const res = await this.mahjongplayerService.getRanking(
      startDate,
      endDate,
      category,
    );
    return res;
  }
}
