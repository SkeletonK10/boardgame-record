export enum MahjongRatingCategory {
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
  players!: MahjongUserRecord[];
}

export class MahjongRankingRecord {
  ranking!: number;
  playerName!: string;
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
