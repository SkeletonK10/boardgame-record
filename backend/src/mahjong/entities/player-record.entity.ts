import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { MahjongPlayer } from '../player/entities/player.entity';
import { MahjongGameRecord } from './game-record.entity';

@Entity()
export class MahjongPlayerRecord {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => MahjongGameRecord, (game) => game.players)
  game: MahjongGameRecord;

  @ManyToOne(() => MahjongPlayer, (player) => player.games)
  player: MahjongPlayer;

  @Column()
  score: number;
}
