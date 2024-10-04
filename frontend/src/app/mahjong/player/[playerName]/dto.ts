import {
  MahjongCategory,
  MahjongGameRecord,
  MahjongSubcategory,
} from "../../dto";
import { MahjongPlayerStatistics } from "../../statistics/player/dto";

export type MahjongPlayerRankingDict = Record<MahjongCategory, number[]>;

export type MahjongPlayerRecordDict = Record<
  MahjongCategory,
  MahjongGameRecord[]
>;

export type MahjongPlayerstatisticsDict = Record<
  MahjongCategory,
  MahjongPlayerStatistics
>;

export class MahjongPlayerPageDto {
  playerName!: string;
  nickname!: string;
  rankings!: MahjongPlayerRankingDict;
  records!: MahjongPlayerRecordDict;
  statistics!: MahjongPlayerstatisticsDict;
}
