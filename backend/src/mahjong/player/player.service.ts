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
    const { playerName, nickname } = createMahjongPlayerDto;
    const existingPlayer = await this.findOneByPlayerName(playerName);
    if (existingPlayer) throw new Error(`MAHJONG_PLAYER_ALREADY_EXIST`);
    const player = this.mahjongPlayerRepository.create({
      playerName,
      nickname,
    });
    return await this.mahjongPlayerRepository.save(player);
  }

  // TODO: User entity와 연동하는 메소드

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

  async getAll() {
    const res = await this.mahjongPlayerRepository.find({
      select: ['playerName', 'nickname', 'rating'],
      order: { rating: 'DESC' },
    });
    return res;
  }
}
