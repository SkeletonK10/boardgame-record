// [
//   {
//     east: { nickname: "참가자1", score: 73000 },
//     south: { nickname: "참가자2", score: -23000 },
//     west: { nickname: "참가자3", score: 25000 },
//     north: { nickname: "참가자4", score: 25000 },
//   },
//   {
//     east: { nickname: "참가자2", score: 73000 },
//     south: { nickname: "참가자1", score: -23000 },
//     west: { nickname: "참가자3", score: 25000 },
//     north: { nickname: "참가자4", score: 25000 },
//   },
//   ...
// ]

export class MahjongUserRecord {
  nickname!: string;
  score!: number; // Can be used 2 ways: single game score / Entire uma
}

export class MahjongGameRecord {
  east!: MahjongUserRecord;
  south!: MahjongUserRecord;
  west!: MahjongUserRecord;
  north?: MahjongUserRecord;
}

export class MahjongMainPageDto {
  record: MahjongGameRecord[] = [];
  ranking: MahjongUserRecord[] = [];
}
