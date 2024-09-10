import { Injectable } from '@nestjs/common';
import { CreateMahjongGameDto } from './dto/create-mahjong.dto';
import { MahjongPlayerService } from './player/player.service';
import {
  MahjongCategory,
  MahjongGameRecord,
} from './entities/game-record.entity';
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
    const rating = this.calculateRating(scores, createMahjongGameDto.category);

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

  calculateRating(scores: number[], category: MahjongCategory) {
    const multiplier = category === '반장전' ? 2 : 1;
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
      .map((v) => v[0] * multiplier);
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
    const p = await this.mahjongPlayerService.findOneByPlayerName(
      player.playerName,
    );
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

  async findById(id: number) {
    const queryResult = await this.dataSource
      .createQueryBuilder(MahjongPlayerRecord, 'record')
      .leftJoin('record.game', 'game')
      .leftJoin('record.player', 'player')
      .where('game.id = :id', { id })
      .orderBy('record.seat')
      .select([
        'game.id',
        'game.category',
        'player.playerName',
        'player.nickname',
        'record.score',
      ])
      .getRawMany();
    console.log(queryResult);
    if (queryResult.length === 0) throw new Error(`ID_GAME_DOES_NOT_EXISTS`);
    return {
      category: queryResult[0].game_category,
      players: queryResult.map((player) => {
        return {
          playerName: player.player_playerName,
          nickname: player.player_nickname,
          score: player.record_score,
        };
      }),
    };
  }

  async delete(id: number) {
    const game = await this.findById(id);
    console.log(game);
    const scores = game.players.map(({ score }) => +score);
    const rating = this.calculateRating(scores, game.category);
    const rollbackRating = rating.map((r) => -r);
    console.log(rollbackRating);
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const playerRecords = await Promise.all(
        // 각 player마다
        game.players.map(async ({ playerName }, i) => {
          const player =
            await this.mahjongPlayerService.findOneByPlayerName(playerName);
          if (!player) {
            return;
          }
          const updatedPlayer = await this.updateRating(
            player,
            rollbackRating[i],
            queryRunner,
          );
          return;
        }),
      );
      await queryRunner.manager
        .createQueryBuilder()
        .softDelete()
        .from(MahjongPlayerRecord)
        .where('game = :id', { id })
        .execute();

      await queryRunner.manager
        .createQueryBuilder()
        .softDelete()
        .from(MahjongGameRecord)
        .where('id = :id', { id })
        .execute();

      await queryRunner.commitTransaction();
      await queryRunner.release();
      return;
    } catch (err) {
      console.error(err);
      await queryRunner.rollbackTransaction();
      await queryRunner.release();
      throw new Error(`MAHJONG_DELETE_GAME_RECORD_FAIL`);
    }
  }
}
