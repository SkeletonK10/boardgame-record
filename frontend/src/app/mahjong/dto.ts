export const MahjongCategoryValues = ["4마", "3마"];

export type MahjongCategory = (typeof MahjongCategoryValues)[number];

export const MahjongSubcategoryValues = ["반장전", "동풍전"];

export type MahjongSubcategory = (typeof MahjongSubcategoryValues)[number];

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
