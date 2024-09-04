import { MahjongCategory } from '../entities/game-record.entity';

class MahjongPlay {
  playerName: string;
  isGuest: boolean;
  score: number;
}
export class CreateMahjongGameDto {
  category: MahjongCategory;
  players: MahjongPlay[];
}
