import { Injectable } from '@nestjs/common';
import { CreateMahjongGameDto } from './dto/create-mahjong.dto';
import { MahjongPlayerService } from './player/player.service';
import { MahjongGameRecord } from './entities/game-record.entity';
import { DataSource, QueryRunner } from 'typeorm';
import { MahjongPlayerRecord } from './entities/player-record.entity';
import { MahjongPlayer } from './player/entities/player.entity';

@Injectable()
export class MahjongService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly mahjongPlayerService: MahjongPlayerService,
  ) {}

  async create(createMahjongGameDto: CreateMahjongGameDto) {
    // console.log(createMahjongGameDto);
    const players = createMahjongGameDto.players.map(
      ({ playerName }) => playerName,
    );
    const scores = createMahjongGameDto.players.map(({ score }) => +score);

    if (!this.verifyGame(players, scores)) {
      throw new Error(`INVALID_MAHJONG_GAME`);
    }
    const rating = this.calculateRating(scores);

    // TODO: 트랜잭션 따로 빼기
    // TODO: 로직 개선 (요청 따다닥 보내기)
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const playerRecords = await Promise.all(
        // 각 player마다
        createMahjongGameDto.players.map(
          async ({ playerName, isGuest }, seat) => {
            let player =
              await this.mahjongPlayerService.findOneByPlayerName(playerName);
            // 없으면 새로 생성
            if (!player) {
              const nickname = playerName;
              if (isGuest) {
                const guestCount =
                  await this.mahjongPlayerService.countGuestByPlayerName(
                    playerName,
                  );
                playerName += `${guestCount + 1}`;
              }
              player = await this.mahjongPlayerService.create({
                playerName,
                nickname,
              });
            }
            const updatedPlayer = await this.updateRating(
              player,
              rating[seat],
              queryRunner,
            );
            const recordDto = queryRunner.manager.create(MahjongPlayerRecord, {
              player: updatedPlayer,
              seat,
              score: scores[seat],
            });
            const record = await queryRunner.manager.save(
              MahjongPlayerRecord,
              recordDto,
            );
            return record;
          },
        ),
      );
      const game = queryRunner.manager.create(MahjongGameRecord, {
        category: createMahjongGameDto.category,
        players: playerRecords,
      });
      const res = await queryRunner.manager.save(MahjongGameRecord, game);
      await queryRunner.commitTransaction();
      await queryRunner.release();
      return res;
    } catch (err) {
      console.error(err);
      await queryRunner.rollbackTransaction();
      await queryRunner.release();
      throw new Error(`MAHJONG_GAME_RECORD_FAIL`);
    }
  }

  verifyGame(players: string[], scores: number[]) {
    if (players.length !== new Set(players).size) return false;
    const playerCount = scores.length;
    if (playerCount < 3 || 4 < playerCount) return false;
    const targetTotal = playerCount === 3 ? 105000 : 100000;
    const scoreTotal = scores.reduce((acc, val) => acc + val, 0);
    return targetTotal === scoreTotal;
  }

  calculateRating(scores: number[]) {
    const playerCount = scores.length;
    const returnScore = playerCount === 4 ? 25000 : 35000;
    const sortedScores = scores
      .map((v, i) => [(v - returnScore) / 1000, i])
      .sort((v1, v2) => v2[0] - v1[0]);
    const bonusRating = playerCount === 4 ? [15, 5, -5, -15] : [15, 0, -15];
    const updatedRating = sortedScores.map((v, i) => [
      v[0] + bonusRating[i],
      v[1],
    ]);
    const sortedRating = updatedRating
      .sort((v1, v2) => v1[1] - v2[1])
      .map((v) => v[0]);
    // console.log(scores);
    // console.log(sortedScores);
    // console.log(sortedRating);
    return sortedRating;
  }

  async updateRating(
    player: MahjongPlayer,
    delta: number,
    queryRunner: QueryRunner,
  ) {
    const res = await queryRunner.manager.update(
      MahjongPlayer,
      { playerName: player.playerName },
      {
        rating: () => `rating + ${delta}`,
      },
    );
    player.rating += delta;
    return player;
  }

  async findAll() {
    const queryResult = await this.dataSource
      .createQueryBuilder(MahjongPlayerRecord, 'record')
      .leftJoin('record.game', 'game')
      .orderBy('game.id')
      .addOrderBy('record.seat')
      .leftJoin('record.player', 'player')
      .select(['game.id', 'game.category', 'player.nickname', 'record.score'])
      .getRawMany();
    // console.log(queryResult);

    const groupedResult = queryResult.reduce((acc, v) => {
      const { game_id } = v;
      if (acc[game_id]) acc[game_id].push(v);
      else acc[game_id] = [v];
      return acc;
    }, {});
    // console.log(groupedResult);
    const result = Object.values(groupedResult).map((game: Array<any>) => {
      return {
        id: queryResult[0].game_id,
        category: game[0].game_category,
        players: game.map((player) => {
          return {
            nickname: player.player_nickname,
            score: player.record_score,
          };
        }),
      };
    });
    console.log(result);
    return result;
  }
}
