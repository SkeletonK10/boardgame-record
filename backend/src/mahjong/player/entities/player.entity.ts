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
import { MahjongRating } from './rating.entity';

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

  @OneToMany(() => MahjongRating, (rating) => rating.player)
  rating: MahjongRating[];

  @OneToMany(() => MahjongPlayerRecord, (record) => record.player)
  games: MahjongPlayerRecord[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
