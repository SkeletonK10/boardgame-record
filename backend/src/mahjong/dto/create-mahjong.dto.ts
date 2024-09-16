import { MahjongSubcategory } from '../enum/mahjong.enum';

class MahjongPlay {
  playerName: string;
  isGuest: boolean;
  score: number;
}
export class CreateMahjongGameDto {
  subcategory: MahjongSubcategory;
  players: MahjongPlay[];
}
