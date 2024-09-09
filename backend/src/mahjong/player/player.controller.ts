import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { MahjongPlayerService } from './player.service';
import { CreateMahjongPlayerDto } from './dto/create-mahjong.dto';
import { JwtAccessTokenGuard } from 'src/auth/guard/access-token.guard';
import { RoleGuard, Roles } from 'src/auth/guard/role.guard';
import { Role } from 'src/user/entities/role.entity';

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

  @Get('ranking')
  async getRanking() {
    return await this.MahjongplayerService.getRanking();
  }
}
