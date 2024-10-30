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
import { MahjongPlayerService } from './player.service';
import { CreateMahjongPlayerDto } from './dto/create.player.dto';
import { JwtAccessTokenGuard } from 'src/auth/guard/accesstoken.guard';
import { RoleGuard, Roles } from 'src/auth/guard/role.guard';
import { Role } from 'src/user/entities/role.entity';
import { MahjongCategory } from '../constants/mahjong.constant';
import { ServiceException } from 'src/common/exception/exception';

@Controller('mahjong/player')
export class MahjongPlayerController {
  constructor(private readonly MahjongplayerService: MahjongPlayerService) {}

  @UseGuards(JwtAccessTokenGuard, RoleGuard)
  @Roles(Role.ADMIN)
  @Post()
  async create(@Body() createMahjongPlayerDto: CreateMahjongPlayerDto) {
    return await this.MahjongplayerService.create(createMahjongPlayerDto);
  }

  @UseGuards(JwtAccessTokenGuard, RoleGuard)
  @Roles(Role.ADMIN)
  @HttpCode(200)
  @Post('guest-count')
  async countGuestCount(@Body('playerName') playerName: string) {
    return await this.MahjongplayerService.countGuestByPlayerName(playerName);
  }

  @Get()
  async getAll() {
    const res = await this.MahjongplayerService.getAll();
    return res;
  }

  @Get('/:playername/info')
  async findOne(@Param('playername') playerName: string) {
    const res = await this.MahjongplayerService.findOneByPlayerName(playerName);
    if (!res) throw new ServiceException('MAHJONG_GAME_PLAYER_DOES_NOT_EXISTS');
    return res;
  }

  @Get('ranking')
  async getRanking(@Query('category') category: MahjongCategory) {
    const res = await this.MahjongplayerService.getRanking(category);
    return res;
  }
}
