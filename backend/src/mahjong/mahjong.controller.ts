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
import {
  getDetailedGameExample,
  getGameExample,
  playerStatisticsExample,
} from './constants/mahjong.example';

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
    @Query('playername') playerName?: string,
    @Query('category') category?: MahjongCategory,
    @Query('startdate') startDate?: string, // ISO 8601 (YYYY-MM-DD)
    @Query('enddate') endDate?: string,
  ) {
    const res = await this.mahjongService.findAll(
      playerName,
      category,
      startDate,
      endDate,
    );
    return res;
  }

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
    @Query('category') category?: MahjongCategory,
    @Query('playername') playerName?: string,
    @Query('startdate') startDate?: string, // ISO 8601 (YYYY-MM-DD)
    @Query('enddate') endDate?: string,
  ) {
    const res = await this.mahjongService.getPlayerStatistics(
      category,
      playerName,
      startDate,
      endDate,
    );
    return res;
  }
}
