export enum MahjongCategory {
  fourPlayer = "4마",
  threePlayer = "3마",
}

export enum MahjongSubcategory {
  half = "반장전",
  east = "동풍전",
}

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
