import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserService } from 'src/user/user.service';
import { MahjongPlayer } from './entities/player.entity';
import { Like, Repository } from 'typeorm';
import { CreateMahjongPlayerDto } from './dto/create-mahjong.dto';
import { MahjongRatingCategory } from '../enum/mahjong.enum';
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
    const ratings = await Promise.all(
      Object.values(MahjongRatingCategory).map(async (category) => {
        const rating = this.mahjongRatingRepository.create({
          player,
          category,
        });
        await this.mahjongRatingRepository.save(rating);
      }),
    );
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
    // const res = await this.mahjongPlayerRepository.find({
    //   select: ['playerName', 'nickname', 'rating'],
    //   order: { rating: 'DESC' },
    // });

    // const queryResult = await this.dataSource
    //   .createQueryBuilder(MahjongPlayerRecord, 'record')
    //   .leftJoin('record.game', 'game')
    //   .leftJoin('record.player', 'player')
    //   .where('game.id = :id', { id })
    //   .orderBy('record.seat')
    //   .select([
    //     'game.id',
    //     'game.ratingCategory',
    //     'game.category',
    //     'player.playerName',
    //     'player.nickname',
    //     'record.score',
    //   ])
    //   .getRawMany();
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
}
