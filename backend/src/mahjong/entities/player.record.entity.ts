import {
  Column,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { MahjongPlayer } from '../player/entities/player.entity';
import { MahjongGameRecord } from './game.record.entity';
import { MahjongSeat } from '../constants/mahjong.constant';
import { MahjongYakumanRecord } from './yakuman.record.entity';

@Entity()
export class MahjongPlayerRecord {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => MahjongGameRecord, (game) => game.players)
  game: MahjongGameRecord;

  @ManyToOne(() => MahjongPlayer, (player) => player.games)
  player: MahjongPlayer;

  @OneToMany(() => MahjongYakumanRecord, (yakuman) => yakuman.record)
  yakumans: MahjongYakumanRecord;

  @Column()
  seat: MahjongSeat;

  @Column()
  rank: number;

  @Column()
  score: number;

  @DeleteDateColumn()
  deletedAt: Date;
}
