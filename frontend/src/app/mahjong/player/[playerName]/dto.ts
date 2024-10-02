import {
  MahjongCategory,
  MahjongGameRecord,
  MahjongSubcategory,
} from "../../dto";
import { MahjongPlayerStatistics } from "../../statistics/player/dto";

export type MahjongPlayerRankingDict = {
  [key in MahjongCategory]: number[];
};

export type MahjongPlayerRecordDict = {
  [key in MahjongCategory]: MahjongGameRecord[];
};

export type MahjongPlayerstatisticsDict = {
  [key in MahjongCategory]: MahjongPlayerStatistics;
};

export class MahjongPlayerPageDto {
  playerName!: string;
  nickname!: string;
  rankings!: MahjongPlayerRankingDict;
  records!: MahjongPlayerRecordDict;
  statistics!: MahjongPlayerstatisticsDict;
}
