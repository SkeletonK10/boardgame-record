import { MahjongCategory } from '../entities/game-record.entity';

class MahjongPlay {
  playerName: string;
  score: number;
}
export class CreateMahjongGameDto {
  category: MahjongCategory;
  east: MahjongPlay;
  south: MahjongPlay;
  west: MahjongPlay;
  north?: MahjongPlay;
}
