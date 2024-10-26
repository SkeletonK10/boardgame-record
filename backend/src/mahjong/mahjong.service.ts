import { Injectable } from '@nestjs/common';
import {
  CreateMahjongGameDto,
  YakumanRecordDto,
} from './dto/create.mahjong.dto';
import { MahjongPlayerService } from './player/player.service';
import { MahjongGameRecord } from './entities/game.record.entity';
import { DataSource, QueryRunner } from 'typeorm';
import { MahjongPlayerRecord } from './entities/player.record.entity';
import { MahjongPlayer } from './player/entities/player.entity';
import { MahjongRating } from './player/entities/rating.entity';
import {
  MahjongCategory,
  MahjongSubcategory,
  MahjongYakuman,
  MAX_YAKUMAN_COUNT,
  OverlappableYakuman,
} from './constants/mahjong.constant';
import { ServiceException } from 'src/common/exception/exception';
import { combination } from 'src/common/utils';

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
    const scores = createMahjongGameDto.players.map(({ score }) => +score);

    if (!(await this.verifyGame(createMahjongGameDto))) {
      throw new ServiceException('INVALID_MAHJONG_GAME');
    }
    const category = createMahjongGameDto.players.length === 4 ? '4마' : '3마';
    const rating = this.calculateRating(
      scores,
      createMahjongGameDto.subcategory,
    );
    const ranks = this.calculateRank(rating);
    const note = createMahjongGameDto.note || null;

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
              } else {
                throw new ServiceException(
                  'MAHJONG_GAME_PLAYER_DOES_NOT_EXISTS',
                );
              }
              player = await this.mahjongPlayerService.create({
                playerName,
                nickname,
              });
            }
            // console.log(seat);
            const updatedPlayer = await this.updateRating(
              player,
              category,
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
        category: category,
        subcategory: createMahjongGameDto.subcategory,
        players: playerRecords,
        note: note,
      });
      const res = await queryRunner.manager.save(MahjongGameRecord, game);
      await queryRunner.commitTransaction();
      await queryRunner.release();
      return res;
    } catch (err) {
      // console.error(err);
      await queryRunner.rollbackTransaction();
      await queryRunner.release();
      if (err instanceof ServiceException) {
        throw err;
      } else {
        throw new ServiceException('MAHJONG_CREATE_GAME_RECORD_FAIL');
      }
    }
  }

  async verifyGame(createMahjongGameDto: CreateMahjongGameDto) {
    const players = createMahjongGameDto.players.map(
      ({ playerName }) => playerName,
    );
    const scores = createMahjongGameDto.players.map(({ score }) => +score);

    await Promise.all([
      ...createMahjongGameDto.yakumans.map(
        async (v) => await this.verifyYakuman(v, players),
      ),
      ...players.map(async (playerName) => {
        const res =
          await this.mahjongPlayerService.findOneByPlayerName(playerName);
        if (!res)
          throw new ServiceException('MAHJONG_GAME_PLAYER_DOES_NOT_EXISTS');
      }),
    ]);

    if (players.length !== new Set(players).size)
      throw new ServiceException('MAHJONG_GAME_DUPLICATE_PLAYER');
    const playerCount = scores.length;
    if (playerCount < 3 || 4 < playerCount)
      throw new ServiceException('MAHJONG_GAME_INVALID_PLAYER_NUMBER');
    const targetTotal = playerCount === 3 ? 105000 : 100000;
    const scoreTotal = scores.reduce((acc, val) => acc + val, 0);
    if (targetTotal !== scoreTotal)
      throw new ServiceException('MAHJONG_GAME_INVALID_SCORE');
    return true;
  }

  async verifyYakuman(yakuman: YakumanRecordDto, players: string[]) {
    console.log(yakuman);
    const winnerEntity = this.mahjongPlayerService.findOneByPlayerName(
      yakuman.winner,
    );
    const opponentEntity = this.mahjongPlayerService.findOneByPlayerName(
      yakuman.opponent,
    );
    if (
      !winnerEntity ||
      !opponentEntity ||
      !players.includes(yakuman.winner) ||
      !players.includes(yakuman.opponent)
    )
      throw new ServiceException('MAHJONG_GAME_PLAYER_DOES_NOT_EXISTS');
    if (yakuman.winner === yakuman.opponent)
      throw new ServiceException('YAKUMAN_DUPLICATED_PLAYER');
    if (yakuman.yakuman.length > MAX_YAKUMAN_COUNT)
      throw new ServiceException('YAKUMAN_TOO_MANY_OVERLAPPING_YAKUMAN');
    const yakumanComb: MahjongYakuman[][] = combination(yakuman.yakuman, 2);
    yakumanComb.forEach(([v1, v2]) => {
      console.log([v1, v2]);
      if (!OverlappableYakuman[v1].includes(v2))
        throw new ServiceException('YAKUMAN_WRONG_COMBINATION');
    });
  }

  calculateRating(scores: number[], subcategory: MahjongSubcategory) {
    const multiplier = subcategory === '반장전' ? 1 : 0.5;
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
    category: MahjongCategory,
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

  async findAll(playerName?: string, category?: MahjongCategory) {
    const categoryWhere = category ? 'game."category"=:category' : 'TRUE';
    const playerNameWhere = playerName
      ? 'player."playerName"=:playerName'
      : 'TRUE';
    const filterQueryBuilder = this.dataSource
      .createQueryBuilder(MahjongPlayerRecord, 'record')
      .leftJoin('record.game', 'game')
      .leftJoin('record.player', 'player')
      .where(categoryWhere, { category })
      .andWhere(playerNameWhere, { playerName })
      .select('game.id AS id')
      .distinct(true);

    const gameIdFilterArray =
      category || playerName
        ? (await filterQueryBuilder.getRawMany()).map(({ id }) => +id)
        : [];
    const gameIdFilterWhere =
      category || playerName
        ? gameIdFilterArray.length > 0
          ? 'game.id IN (:...ids)'
          : 'FALSE'
        : 'TRUE';

    const queryResult = await this.dataSource
      .createQueryBuilder(MahjongPlayerRecord, 'record')
      .leftJoin('record.game', 'game')
      .orderBy('game.id')
      .addOrderBy('record.seat')
      .leftJoin('record.player', 'player')
      .where(gameIdFilterWhere, { ids: gameIdFilterArray })
      .select([
        'game.id',
        'game.subcategory',
        'game.category',
        'game.note',
        'player."playerName" AS "playerName"',
        'player.nickname',
        'record.seat',
        'record.rank',
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
        subcategory: game[0].game_subcategory,
        category: game[0].game_category,
        players: game.map((player) => {
          return {
            playerName: player.playerName,
            nickname: player.player_nickname,
            seat: player.record_seat,
            rank: player.record_rank,
            score: player.record_score,
          };
        }),
        note: game[0].game_note,
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
        'game.subcategory',
        'game.category',
        'player.playerName',
        'player.nickname',
        'record.score',
        'game.note',
      ])
      .getRawMany();
    console.log(queryResult);
    if (queryResult.length === 0)
      throw new ServiceException('MAHJONG_GAME_ID_DOES_NOT_EXISTS');
    return {
      category: queryResult[0].game_category,
      subcategory: queryResult[0].game_subcategory,
      players: queryResult.map((player) => {
        return {
          playerName: player.player_playerName,
          nickname: player.player_nickname,
          score: player.record_score,
        };
      }),
      note: queryResult[0].game_note,
    };
  }

  async delete(id: number) {
    const game = await this.findById(id);
    console.log(game);
    const scores = game.players.map(({ score }) => +score);
    const rating = this.calculateRating(scores, game.subcategory);
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
            game.category,
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
      // console.error(err);
      await queryRunner.rollbackTransaction();
      await queryRunner.release();
      throw new ServiceException(`MAHJONG_DELETE_GAME_RECORD_FAIL`);
    }
  }

  async getPlayerStatistics(category?: MahjongCategory, playerName?: string) {
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
    //         game."category" AS category,
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
    //     WHERE ( game."category"=$1 ) AND ( "record"."deletedAt" IS NULL )
    //     GROUP BY "player"."id", game."category"
    // ) "r"
    // ON rating."playerId" = r."playerId" AND rating."category" = r."category";
    const categoryWhere = category ? 'game."category"=:category' : 'TRUE';
    const playerNameWhere = playerName
      ? 'player."playerName"=:playerName'
      : 'TRUE';
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
              'game."category" AS category',
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
            .where(categoryWhere, { category })
            .andWhere(playerNameWhere, { playerName })
            .groupBy('player.id')
            .addGroupBy('game."category"'),
        'r',
        'rating."playerId" = r."playerId" AND rating."category"=r."category"',
      )
      .select([
        'r."playerId" AS id',
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
