export enum MahjongRatingCategory {
  fourPlayer = "4마",
  threePlayer = "3마",
}

export class MahjongUserRecord {
  nickname!: string;
  score!: number;
}

export class MahjongGameRecord {
  category!: string;
  players!: MahjongUserRecord[];
}

export class MahjongRankingRecord {
  nickname!: string;
  rating!: number;
}

export class MahjongRanking {
  category!: MahjongRatingCategory;
  ranking: MahjongRankingRecord[] = [];
}

export class MahjongMainPageDto {
  record: MahjongGameRecord[] = [];
  ranking: MahjongRanking[] = [];
}
