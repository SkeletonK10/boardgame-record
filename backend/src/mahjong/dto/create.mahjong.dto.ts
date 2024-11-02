import { MahjongSubcategory } from '../constants/mahjong.constant';

export class PlayerRecordDto {
  playerName: string;
  isGuest: boolean;
  score: number;
}

export class YakumanRecordDto {
  // 역만 종류
  yakuman: string[];
  // 화료자
  winner: string;
  // 방총자 (쯔모 시엔 null)
  opponent: string | null;
  // 동 n국 m본장 (모르면 null)
  round: string | null;
}

export class CreateMahjongGameDto {
  subcategory: MahjongSubcategory;
  players: PlayerRecordDto[];
  yakumans: YakumanRecordDto[];
  note?: string;
}
