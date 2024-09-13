import {
  Column,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { MahjongPlayer } from '../player/entities/player.entity';
import { MahjongGameRecord } from './game-record.entity';

export enum MahjongSeat {
  east,
  south,
  west,
  north,
}

@Entity()
export class MahjongPlayerRecord {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => MahjongGameRecord, (game) => game.players)
  game: MahjongGameRecord;

  @ManyToOne(() => MahjongPlayer, (player) => player.games)
  player: MahjongPlayer;

  @Column()
  seat: MahjongSeat;

  @Column()
  rank: number;

  @Column()
  score: number;

  @DeleteDateColumn()
  deletedAt: Date;
}
