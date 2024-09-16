import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserService } from 'src/user/user.service';
import { MahjongPlayer } from './entities/player.entity';
import { Like, Repository } from 'typeorm';
import { CreateMahjongPlayerDto } from './dto/create-mahjong.dto';
import { MahjongCategory } from '../enum/mahjong.enum';
import { MahjongRating } from './entities/rating.entity';

@Injectable()
export class MahjongPlayerService {
  constructor(
    @InjectRepository(MahjongPlayer)
    private mahjongPlayerRepository: Repository<MahjongPlayer>,
    @InjectRepository(MahjongRating)
    private mahjongRatingRepository: Repository<MahjongRating>,
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
    await this.mahjongPlayerRepository.save(player);
    return player;
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
      select: {
        playerName: true,
        nickname: true,
        rating: {
          category: true,
          rating: true,
        },
      },
      relations: ['rating'],
    });
    return res;
  }

  async getRanking(category: MahjongCategory) {
    const res = await this.mahjongRatingRepository
      .createQueryBuilder('rating')
      .leftJoin('rating.player', 'player')
      .where('rating.category = :category', { category })
      .select([
        'player.playerName AS playerName',
        'player.nickname AS nickname',
        'rating.rating AS rating',
        'RANK () OVER (ORDER BY "rating"."rating" DESC) AS ranking',
      ])
      .getRawMany();
    return res;
  }
}
