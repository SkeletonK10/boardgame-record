// Basic Enumerations /////////////////////////////////////////////////////////

export const MahjongCategoryValues = ["4마", "3마"];

export type MahjongCategory = (typeof MahjongCategoryValues)[number];

export const MahjongSubcategoryValues = ["반장전", "동풍전"];

export type MahjongSubcategory = (typeof MahjongSubcategoryValues)[number];

// Main page //////////////////////////////////////////////////////////////////

export class MahjongUserRecord {
  playerName!: string;
  nickname!: string;
  rank!: number;
  seat!: number;
  score!: number;
}

export class MahjongGameRecord {
  id!: number;
  category!: string;
  subcategory!: string;
  players!: MahjongUserRecord[];
  note?: string;
}

export class MahjongRankingRecord {
  ranking!: number;
  playerName!: string;
  nickname!: string;
  rating!: number;
}

export class MahjongRanking {
  category!: MahjongCategory;
  ranking: MahjongRankingRecord[] = [];
}

export class MahjongMainPageDto {
  record: MahjongGameRecord[] = [];
  ranking: MahjongRanking[] = [];
}

// Statistics page ////////////////////////////////////////////////////////////

export class MahjongPlayerStatistics {
  playerName!: string;
  nickname!: string;
  category!: string;
  rating!: number;
  averageRating!: number;
  averageScore!: number;
  maxScore!: number;
  minScore!: number;
  count!: number;
  first!: number;
  second!: number;
  third!: number;
  fourth!: number;
  tobi!: number;
}

// Player page ////////////////////////////////////////////////////////////////

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

// Add record page ////////////////////////////////////////////////////////////

export class MahjongPlayersDto {
  playerName!: string;
  nickname!: string;
}