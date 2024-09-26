import { MahjongCategory, MahjongSubcategory } from "../../dto";

class MahjongPlayerRecord {
  gameId!: number;
  category!: MahjongCategory;
  subcategory!: MahjongSubcategory;
  seat!: string;
  rank!: number;
}

export type MahjongPlayerRecordList = {
  [key in MahjongCategory]: MahjongPlayerRecord[];
};

export class MahjongPlayerPageDto {
  records!: MahjongPlayerRecordList;
}
