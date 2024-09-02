import { User } from 'src/user/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

export enum MahjongCategory {
  east = `동풍전`,
  south = `반장전`,
  other = `기타`,
}

// MahjongPlayer
// User와 별개의 엔티티, OneToOne 매핑 (nickname)
// 우마, 판수 등 추가 정보 필요
@Entity()
export class MahjongPlayer {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => User)
  @JoinColumn()
  user?: User;

  @Column({ default: 0 })
  rating: number;
}

// MahjongPlayerRecord
// { player: MahjongPlayer, score: number }
@Entity()
export class MahjongPlayerRecord {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => MahjongPlayer)
  player: MahjongPlayer;

  @Column()
  score: number;
}

@Entity()
export class MahjongGameRecord {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => MahjongPlayerRecord)
  @JoinColumn()
  east: MahjongPlayerRecord;

  @OneToOne(() => MahjongPlayerRecord)
  @JoinColumn()
  south: MahjongPlayerRecord;

  @OneToOne(() => MahjongPlayerRecord)
  @JoinColumn()
  west: MahjongPlayerRecord;

  @OneToOne(() => MahjongPlayerRecord)
  @JoinColumn()
  north?: MahjongPlayerRecord;

  @Column()
  category: MahjongCategory;

  @Column({ type: 'text' })
  note?: string;
}
