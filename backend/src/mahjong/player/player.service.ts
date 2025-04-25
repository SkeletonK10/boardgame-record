import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserService } from 'src/user/user.service';
import { MahjongPlayer } from './entities/player.entity';
import { Like, Repository } from 'typeorm';
import { CreateMahjongPlayerDto } from './dto/create.player.dto';
import { MahjongCategory } from '../constants/mahjong.constant';
import { ServiceException } from 'src/common/exception/exception';
import { nthAlphabet } from 'src/common/utils';
import { MahjongPlayerRecord } from '../entities/player.record.entity';

@Injectable()
export class MahjongPlayerService {
  constructor(
    @InjectRepository(MahjongPlayer)
    private mahjongPlayerRepository: Repository<MahjongPlayer>,
    @InjectRepository(MahjongPlayerRecord)
    private mahjongPlayerRecordRepository: Repository<MahjongPlayerRecord>,
    private readonly userService: UserService,
  ) {}

  async create(createMahjongPlayerDto: CreateMahjongPlayerDto) {
    if (!createMahjongPlayerDto.playerName) {
      const guestCount = await this.countGuestByPlayerName(
        createMahjongPlayerDto.nickname,
      );
      const nickname = createMahjongPlayerDto.nickname;
      const playerName = nickname + nthAlphabet(guestCount);
      createMahjongPlayerDto = {
        playerName,
        nickname,
      };
    }
    const { playerName, nickname } = createMahjongPlayerDto;
    const existingPlayer = await this.findOneByPlayerName(playerName);
    if (existingPlayer)
      throw new ServiceException(`MAHJONG_PLAYER_ALREADY_EXIST`);
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
      },
      order: {
        gameCount: 'DESC',
      },
    });
    return res;
  }

  async getRanking(
    startDate: string,
    endDate: string,
    category: MahjongCategory,
  ) {
    const createdAtWhere = `game."createdAt" BETWEEN :startDate AND :endDate`;

    const res = await this.mahjongPlayerRecordRepository
      .createQueryBuilder('record')
      .leftJoin('record.player', 'player')
      .leftJoin('record.game', 'game')
      .where('game.category = :category', { category })
      .andWhere(createdAtWhere, {
        startDate,
        endDate,
      })
      .select([
        'player."playerName" AS "playerName"',
        'MAX(player.nickname) AS nickname',
        'SUM(record."ratingDiff") AS rating',
        'RANK () OVER (ORDER BY SUM(record."ratingDiff") DESC) AS ranking',
      ])
      .groupBy('player."playerName"')
      .getRawMany();
    return res;
  }
}
