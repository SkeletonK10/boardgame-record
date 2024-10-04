import { MahjongSubcategory } from '../constants/mahjong.constant';

class MahjongPlay {
  playerName: string;
  isGuest: boolean;
  score: number;
}
export class CreateMahjongGameDto {
  subcategory: MahjongSubcategory;
  players: MahjongPlay[];
  note?: string;
}
