import { MahjongCategory } from '../enum/mahjong.enum';

class MahjongPlay {
  playerName: string;
  isGuest: boolean;
  score: number;
}
export class CreateMahjongGameDto {
  category: MahjongCategory;
  players: MahjongPlay[];
}
