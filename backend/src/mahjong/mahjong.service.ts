import { Injectable } from '@nestjs/common';
import { CreateMahjongGameDto } from './dto/create-mahjong.dto';
import { MahjongPlayerService } from './player/player.service';
import { MahjongGameRecord } from './entities/game-record.entity';
import { DataSource, QueryRunner } from 'typeorm';
import { MahjongPlayerRecord } from './entities/player-record.entity';
import { MahjongPlayer } from './player/entities/player.entity';
import { MahjongRating } from './player/entities/rating.entity';
import { MahjongCategory, MahjongRatingCategory } from './enum/mahjong.enum';

@Injectable()
export class MahjongService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly mahjongPlayerService: MahjongPlayerService,
  ) {}

  async create(createMahjongGameDto: CreateMahjongGameDto) {
    // console.log(createMahjongGameDto);
    createMahjongGameDto.players = createMahjongGameDto.players.filter(
      ({ playerName }) => typeof playerName === 'string',
    );
    const players = createMahjongGameDto.players.map(
      ({ playerName }) => playerName,
    );
    const scores = createMahjongGameDto.players.map(({ score }) => +score);

    console.log(players);
    console.log(scores);
    if (!this.verifyGame(players, scores)) {
      throw new Error(`INVALID_MAHJONG_GAME`);
    }
    const ratingCategory =
      players.length === 4
        ? MahjongRatingCategory.fourPlayer
        : MahjongRatingCategory.threePlayer;
    const rating = this.calculateRating(scores, createMahjongGameDto.category);
    const ranks = this.calculateRank(rating);

    console.log(rating);
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
                playerName += this.nthAlphabet(guestCount + 1);
              }
              player = await this.mahjongPlayerService.create({
                playerName,
                nickname,
              });
            }
            // console.log(seat);
            const updatedPlayer = await this.updateRating(
              player,
              ratingCategory,
              rating[seat],
              queryRunner,
            );
            const recordDto = queryRunner.manager.create(MahjongPlayerRecord, {
              player: updatedPlayer,
              seat,
              rank: ranks[seat],
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
        ratingCategory: ratingCategory,
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
    const multiplier = category === '반장전' ? 1 : 0.5;
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

  calculateRank(ratings: number[]) {
    const sortedRatings = ratings
      .map((r, seat) => [r, seat])
      .sort((v1, v2) => v2[0] - v1[0]);
    const rank = sortedRatings
      .map((v, i) => [...v, i + 1]) // [rating, seat, rank]
      .sort((v1, v2) => v1[1] - v2[1])
      .map((v) => v[2]);
    return rank;
  }

  nthAlphabet(n: number) {
    const l: number[] = [];
    const a = 'A'.charCodeAt(0);
    while (n) {
      console.log(n);
      const q = n % 26;
      n = Math.floor(n / 26);
      if (q) l.push(a + q - 1);
    }
    return String.fromCharCode(...l.reverse());
  }

  async updateRating(
    player: MahjongPlayer,
    category: MahjongRatingCategory,
    delta: number,
    queryRunner: QueryRunner,
  ) {
    const rating = await queryRunner.manager.findOne(MahjongRating, {
      where: {
        player: {
          id: player.id,
        },
        category,
      },
    });

    if (!rating) {
      await queryRunner.manager.insert(MahjongRating, { player, category });
    }

    const res = await queryRunner.manager.update(
      MahjongRating,
      { player, category },
      {
        rating: () => `rating + ${delta}`,
      },
    );
    const p = await this.mahjongPlayerService.findOneByPlayerName(
      player.playerName,
    );
    return p;
  }

  async findAll() {
    const queryResult = await this.dataSource
      .createQueryBuilder(MahjongPlayerRecord, 'record')
      .leftJoin('record.game', 'game')
      .orderBy('game.id')
      .addOrderBy('record.seat')
      .leftJoin('record.player', 'player')
      .select([
        'game.id',
        'game.ratingCategory',
        'game.category',
        'player.nickname',
        'record.score',
      ])
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
        id: game[0].game_id,
        ratingCategory: game[0].game_ratingCategory,
        category: game[0].game_category,
        players: game.map((player) => {
          return {
            nickname: player.player_nickname,
            score: player.record_score,
          };
        }),
      };
    });
    result.reverse();
    // console.log(result);
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
        'game.ratingCategory',
        'game.category',
        'player.playerName',
        'player.nickname',
        'record.score',
      ])
      .getRawMany();
    console.log(queryResult);
    if (queryResult.length === 0) throw new Error(`ID_GAME_DOES_NOT_EXISTS`);
    return {
      ratingCategory: queryResult[0].game_ratingCategory,
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
            game.ratingCategory,
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

  async getAllPlayerStatistics(category?: MahjongRatingCategory) {
    // QUERY
    // SELECT
    //     r."playerName" AS "playerName",
    //     r.nickname AS nickname,
    //     r.category AS category,
    //     "rating"."rating" AS rating,
    //     ROUND("rating"."rating" / r.count, 3) AS "averageRating",
    //     r."averageScore" AS "averageScore",
    //     r."maxScore" AS "maxScore",
    //     r."minScore" AS "minScore",
    //     r.count AS count,
    //     r.first AS first,
    //     r.second AS second,
    //     r.third AS third,
    //     r.fourth AS fourth,
    //     r.tobi AS tobi
    // FROM
    //     "mahjong_rating" "rating"
    // INNER JOIN (
    //     SELECT
    //         "player"."id" AS "playerId",
    //         "player"."playerName" AS "playerName",
    //         "player"."nickname" AS nickname,
    //         game."ratingCategory" AS category,
    //         ROUND(AVG("record"."score"), 2) AS "averageScore",
    //         MAX("record"."score") AS "maxScore",
    //         MIN("record"."score") AS "minScore",
    //         COUNT(*) AS count,
    //         COUNT(CASE WHEN "record"."rank" = 1 THEN 1 ELSE NULL END) AS first,
    //         COUNT(CASE WHEN "record"."rank" = 2 THEN 1 ELSE NULL END) AS second,
    //         COUNT(CASE WHEN "record"."rank" = 3 THEN 1 ELSE NULL END) AS third,
    //         COUNT(CASE WHEN "record"."rank" = 4 THEN 1 ELSE NULL END) AS fourth,
    //         COUNT(CASE WHEN "record"."score" < 0 THEN 1 ELSE NULL END) AS tobi
    //     FROM
    //         "mahjong_player_record" "record"
    //     LEFT JOIN
    //         "mahjong_game_record" "game"
    //     ON
    //         "game"."id"="record"."gameId" AND ("game"."deletedAt" IS NULL)
    //     LEFT JOIN
    //         "mahjong_player" "player"
    //     ON
    //         "player"."id"="record"."playerId"
    //     WHERE ( game."ratingCategory"=$1 ) AND ( "record"."deletedAt" IS NULL )
    //     GROUP BY "player"."id", game."ratingCategory"
    // ) "r"
    // ON rating."playerId" = r."playerId" AND rating."category" = r."category";
    const filterString = category ? 'game."ratingCategory"=:category' : 'TRUE';
    const queryResult = await this.dataSource
      .createQueryBuilder(MahjongRating, 'rating')
      .innerJoin(
        // TODO: 임시 테이블 만들기 (기능 지원하면...)
        (qb) =>
          qb
            .from(MahjongPlayerRecord, 'record')
            .leftJoin('record.game', 'game')
            .leftJoin('record.player', 'player')
            .select([
              'player.id AS "playerId"',
              'player.playerName AS "playerName"',
              'player.nickname AS nickname',
              'game."ratingCategory" AS category',
              'ROUND(AVG(record.score), 2) AS "averageScore"',
              'MAX(record.score) AS "maxScore"',
              'MIN(record.score) AS "minScore"',
              'COUNT(*) AS count',
              'COUNT(CASE WHEN record.rank = 1 THEN 1 ELSE NULL END) AS first',
              'COUNT(CASE WHEN record.rank = 2 THEN 1 ELSE NULL END) AS second',
              'COUNT(CASE WHEN record.rank = 3 THEN 1 ELSE NULL END) AS third',
              'COUNT(CASE WHEN record.rank = 4 THEN 1 ELSE NULL END) AS fourth',
              'COUNT(CASE WHEN record.score < 0 THEN 1 ELSE NULL END) AS tobi',
            ])
            .where(filterString, { category })
            .groupBy('player.id')
            .addGroupBy('game."ratingCategory"'),
        'r',
        'rating."playerId" = r."playerId" AND rating."category"=r."category"',
      )
      .select([
        'r."playerName" AS "playerName"',
        'r.nickname AS nickname',
        'r.category AS category',
        'rating.rating AS rating',
        'ROUND(rating.rating / r.count, 3) AS "averageRating"',
        'r."averageScore" AS "averageScore"',
        'r."maxScore" AS "maxScore"',
        'r."minScore" AS "minScore"',
        'r.count AS count',
        'r.first AS first',
        'r.second AS second',
        'r.third AS third',
        'r.fourth AS fourth',
        'r.tobi AS tobi',
      ])
      .getRawMany();
    return queryResult;
  }
}
