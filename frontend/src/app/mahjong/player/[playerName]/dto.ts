import { MahjongCategory, MahjongSubcategory } from "../../dto";
import { MahjongPlayerStatistics } from "../../statistics/player/dto";

class MahjongPlayerRecord {
  gameId!: number;
  category!: MahjongCategory;
  subcategory!: MahjongSubcategory;
  seat!: string;
  rank!: number;
}

export type MahjongPlayerRecordDict = {
  [key in MahjongCategory]: MahjongPlayerRecord[];
};

export type MahjongPlayerstatisticsDict = {
  [key in MahjongCategory]: MahjongPlayerStatistics;
};

export class MahjongPlayerPageDto {
  playerName!: string;
  nickname!: string;
  records!: MahjongPlayerRecordDict;
  statistics!: MahjongPlayerstatisticsDict;
}
