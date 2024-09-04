import { MahjongPlayerRecord } from 'src/mahjong/entities/player-record.entity';
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

@Entity()
export class MahjongPlayer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  playerName: string;

  @OneToOne(() => User)
  @JoinColumn()
  user?: User;

  @Column({ default: 0 })
  rating: number;

  @OneToMany(() => MahjongPlayerRecord, (record) => record.player)
  games: MahjongPlayerRecord[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
