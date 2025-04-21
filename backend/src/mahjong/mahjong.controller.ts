import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse } from '@nestjs/swagger';
import { JwtAccessTokenGuard } from 'src/auth/guard/accesstoken.guard';
import { RoleGuard, Roles } from 'src/auth/guard/role.guard';
import { Role } from 'src/user/entities/role.entity';
import {
  getDetailedGameExample,
  getGameExample,
  playerStatisticsExample,
} from './constants/mahjong.example';
import { CreateMahjongGameDto } from './dto/create.mahjong.dto';
import { MahjongSeasonOptionDto } from './dto/mahjong.season.option.dto';
import { MahjongOptionDto } from './dto/option.mahjong.dto';
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
    @Query() { startDate, endDate, playerName, category }: MahjongOptionDto,
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
  //   @Query() { season, playerName, category }: MahjongOptionDto
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
    @Query() { startDate, endDate, playerName, category }: MahjongOptionDto,
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
    @Query() { season, playerName, category }: MahjongOptionDto,
  ) {
    const { startDate, endDate } =
      await this.mahjongService.getSeasonPeriod(season);
    const res = await this.mahjongService.getPlayerStatistics(
      startDate,
      endDate,
      category,
      playerName,
    );
    return res;
  }

  @Get('/statistics/rivals')
  async getRivals(
    @Query() { startDate, endDate, playerName, category }: MahjongOptionDto,
  ) {
    const res = await this.mahjongService.getRivals(
      startDate,
      endDate,
      category,
      playerName,
    );
    return res;
  }

  @Get('/statistics/rivals/season')
  async getSeasonRivals(
    @Query() { season, playerName, category }: MahjongOptionDto,
  ) {
    const { startDate, endDate } =
      await this.mahjongService.getSeasonPeriod(season);
    const res = await this.mahjongService.getRivals(
      startDate,
      endDate,
      category,
      playerName,
    );
    return res;
  }

  @UseGuards(JwtAccessTokenGuard, RoleGuard)
  @Roles(Role.MAHJONG_RECORD_ADMIN, Role.ADMIN)
  @Post('season')
  @ApiOkResponse()
  @HttpCode(200)
  async startSeason(@Body() seasonDto: MahjongSeasonOptionDto) {
    const res = await this.mahjongService.startSeason(seasonDto);
    return res;
  }

  @UseGuards(JwtAccessTokenGuard, RoleGuard)
  @Roles(Role.MAHJONG_RECORD_ADMIN, Role.ADMIN)
  @Patch('season')
  @ApiOkResponse()
  @HttpCode(200)
  async manageSeason(@Body() seasonDto: MahjongSeasonOptionDto) {
    const res = await this.mahjongService.modifySeasonEnd(seasonDto);
    return res;
  }

  @Get('season')
  @ApiOkResponse()
  async getAllSeason() {
    const res = await this.mahjongService.getAllSeason();
    return res;
  }
}
