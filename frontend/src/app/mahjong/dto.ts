export class MahjongUserRecord {
  nickname!: string;
  score!: number; // Can be used 2 ways: single game score / Entire uma
}

export class MahjongGameRecord {
  category!: string;
  players!: MahjongUserRecord[];
}

export class MahjongMainPageDto {
  record: MahjongGameRecord[] = [];
  ranking: MahjongUserRecord[] = [];
}
