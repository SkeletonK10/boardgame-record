import { MahjongPlayerRecord } from 'src/mahjong/entities/player.record.entity';
import { User } from 'src/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { MahjongYakumanRecord } from 'src/mahjong/entities/yakuman.record.entity';

@Entity()
export class MahjongPlayer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  playerName: string;

  @Column()
  nickname: string;

  @OneToOne(() => User)
  @JoinColumn()
  user?: User;

  @OneToMany(() => MahjongPlayerRecord, (record) => record.player)
  games: MahjongPlayerRecord[];

  @Column()
  gameCount: number;

  @OneToMany(() => MahjongYakumanRecord, (yakuman) => yakuman.winner)
  yakumans: MahjongYakumanRecord[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
