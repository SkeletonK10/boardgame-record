import { MahjongSubcategory } from '../constants/mahjong.constant';

class PlayerRecordDto {
  playerName: string;
  isGuest: boolean;
  score: number;
}

class YakumanRecordDto {
  // 역만 종류
  yakuman: string[];
  // 화료자
  winner: string;
  // 방총자 (쯔모 시엔 null)
  opponent: string | null;
  // 쯔모했나요?
  tsumo: boolean;
  // 동 n국 m본장 (모르면 null)
  round: string | null;
}

export class CreateMahjongGameDto {
  subcategory: MahjongSubcategory;
  players: PlayerRecordDto[];
  yakumans: YakumanRecordDto[];
  note?: string;
}
