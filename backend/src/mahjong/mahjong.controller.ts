import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse } from '@nestjs/swagger';
import { JwtAccessTokenGuard } from 'src/auth/guard/accesstoken.guard';
import { RoleGuard, Roles } from 'src/auth/guard/role.guard';
import { getCurrentSeason, getSeasonPeriod } from 'src/common/utils';
import { Role } from 'src/user/entities/role.entity';
import { MahjongCategory } from './constants/mahjong.constant';
import {
  getDetailedGameExample,
  getGameExample,
  playerStatisticsExample,
} from './constants/mahjong.example';
import { CreateMahjongGameDto } from './dto/create.mahjong.dto';
import { MahjongService } from './mahjong.service';

@Controller('mahjong')
export class MahjongController {
  constructor(private readonly mahjongService: MahjongService) {}

  @UseGuards(JwtAccessTokenGuard, RoleGuard)
  @Roles(Role.MAHJONG_RECORD_ADMIN, Role.ADMIN)
  @Post('game')
  @ApiCreatedResponse({ example: { id: 345 } })
  async createGame(@Body() createMahjongGameDto: CreateMahjongGameDto) {
    const res = await this.mahjongService.create(createMahjongGameDto);
    return { id: res.id };
  }

  @Get('game')
  @ApiOkResponse({ example: getGameExample })
  async findAll(
    @Query('startdate', new DefaultValuePipe(new Date(1970).toISOString()))
    startDate: string,
    @Query('enddate', new DefaultValuePipe(new Date().toISOString()))
    endDate: string,
    @Query('playername') playerName?: string,
    @Query('category') category?: MahjongCategory,
  ) {
    const res = await this.mahjongService.findAll(
      startDate,
      endDate,
      playerName,
      category,
    );
    return res;
  }

  // 당장은 필요 없을듯?

  // @Get('game/season')
  // @ApiOkResponse({ example: getGameExample })
  // async getSeasonGame(
  //   @Query('season', new DefaultValuePipe(getCurrentSeason())) season: number,
  //   @Query('category') category?: MahjongCategory,
  //   @Query('playername') playerName?: string,
  // ) {
  //   const { start, end } = getSeasonPeriod(season);
  //   const res = await this.mahjongService.findAll(
  //     start,
  //     end,
  //     playerName,
  //     category,
  //   );
  //   return res;
  // }

  @Get('game/:id')
  @ApiOkResponse({ example: getDetailedGameExample })
  async findOneById(@Param('id') id: number) {
    const res = await this.mahjongService.findById(+id);
    return res;
  }

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
  @ApiOkResponse({ example: playerStatisticsExample })
  async getAllStatistics(
    @Query('startdate', new DefaultValuePipe(new Date(1970).toISOString()))
    startDate: string,
    @Query('enddate', new DefaultValuePipe(new Date().toISOString()))
    endDate: string,
    @Query('category') category?: MahjongCategory,
    @Query('playername') playerName?: string,
  ) {
    const res = await this.mahjongService.getPlayerStatistics(
      startDate,
      endDate,
      category,
      playerName,
    );
    return res;
  }

  @Get('/statistics/player/season')
  @ApiOkResponse({ example: playerStatisticsExample })
  async getSeasonStatistics(
    @Query('season', new DefaultValuePipe(getCurrentSeason())) season: number,
    @Query('category') category?: MahjongCategory,
    @Query('playername') playerName?: string,
  ) {
    const { start, end } = getSeasonPeriod(season);
    const res = await this.mahjongService.getPlayerStatistics(
      start,
      end,
      category,
      playerName,
    );
    return res;
  }
}
