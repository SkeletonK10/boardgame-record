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

export class MahjongMainPageDto {
  record: MahjongGameRecord[] = [];
  ranking: MahjongRankingRecord[] = [];
}
