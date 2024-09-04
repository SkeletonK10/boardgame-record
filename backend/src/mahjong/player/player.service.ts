import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserService } from 'src/user/user.service';
import { MahjongPlayer } from './entities/player.entity';
import { Like, Repository } from 'typeorm';
import { CreateMahjongPlayerDto } from './dto/create-mahjong.dto';

@Injectable()
export class MahjongPlayerService {
  constructor(
    @InjectRepository(MahjongPlayer)
    private mahjongPlayerRepository: Repository<MahjongPlayer>,
    private readonly userService: UserService,
  ) {}

  async create(createMahjongPlayerDto: CreateMahjongPlayerDto) {
    const { playerName } = createMahjongPlayerDto;
    const existingPlayer = await this.findOneByPlayerName(playerName);
    if (existingPlayer) throw new Error(`MAHJONG_PLAYER_ALREADY_EXIST`);
    const user = await this.userService.findOneByUsername(playerName);
    const player = this.mahjongPlayerRepository.create({ playerName, user });
    return await this.mahjongPlayerRepository.save(player);
  }

  async findOneByPlayerName(playerName: string) {
    const res = await this.mahjongPlayerRepository.findOne({
      where: { playerName },
    });
    return res;
  }

  async countGuestByPlayerName(playerName: string) {
    const res = await this.mahjongPlayerRepository.count({
      where: {
        playerName: Like(`${playerName}%`),
      },
    });
    return res;
  }
}
