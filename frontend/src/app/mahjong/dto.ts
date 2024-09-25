export enum MahjongCategory {
  fourPlayer = "4마",
  threePlayer = "3마",
}

export class MahjongUserRecord {
  playerName!: string;
  nickname!: string;
  score!: number;
}

export class MahjongGameRecord {
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
