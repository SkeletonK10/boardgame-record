import {
  MahjongCategoryValues,
  MahjongSubcategoryValues,
  MahjongYakumanValues,
} from "@/lib/constants/mahjong";

// Basic Enumerations /////////////////////////////////////////////////////////

export type MahjongCategory = (typeof MahjongCategoryValues)[number];

export type MahjongSubcategory = (typeof MahjongSubcategoryValues)[number];

export type MahjongYakuman = (typeof MahjongYakumanValues)[number];

// Main page //////////////////////////////////////////////////////////////////

export interface MahjongUserRecord {
  playerName: string;
  nickname: string;
  rank: number;
  seat: string;
  score: number;
}

export interface MahjongGameRecord {
  id: number;
  category: string;
  subcategory: string;
  players: MahjongUserRecord[];
  note?: string;
  createdAt: string;
}

export interface MahjongRankingRecord {
  ranking: number;
  playerName: string;
  nickname: string;
  rating: number;
}

export interface MahjongRanking {
  category: MahjongCategory;
  ranking: MahjongRankingRecord[];
}

export interface MahjongMainPageDto {
  record: MahjongGameRecord[];
  ranking: MahjongRanking[];
}

// Statistics page ////////////////////////////////////////////////////////////

export interface MahjongPlayerStatistics {
  playerName: string;
  nickname: string;
  category: string;
  rating: number;
  averageRating: number;
  averageScore: number;
  maxScore: number;
  minScore: number;
  count: number;
  first: number;
  second: number;
  third: number;
  fourth: number;
  tobi: number;
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

export interface MahjongPlayerPageDto {
  playerName: string;
  nickname: string;
  rankings: MahjongPlayerRankingDict;
  records: MahjongPlayerRecordDict;
  statistics: MahjongPlayerstatisticsDict;
}

// Add record page ////////////////////////////////////////////////////////////

export interface MahjongPlayersDto {
  playerName: string;
  nickname: string;
}

// Game page //////////////////////////////////////////////////////////////////

export interface MahjongDetailedUserRecord {
  playerName: string;
  nickname: string;
  rank: number;
  ratingDiff: number;
  seat: string;
  score: number;
}

export interface MahjongYakumanRecord {
  // 역만 종류
  yakuman: string[];
  // 화료자
  winner: string;
  // 방총자 (쯔모 시엔 null)
  opponent: string | null;
  // 동 n국 m본장 (모르면 null)
  round: string | null;
}

export interface MahjongDetailedGameDto {
  id: number;
  category: string;
  subcategory: string;
  players: MahjongDetailedUserRecord[];
  note?: string;
  createdAt: string;
  yakumans: MahjongYakumanRecord[];
}
