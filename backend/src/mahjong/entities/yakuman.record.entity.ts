import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  RelationId,
  UpdateDateColumn,
} from 'typeorm';
import { MahjongYakuman } from '../constants/mahjong.constant';
import { MahjongGameRecord } from './game.record.entity';
import { MahjongPlayer } from '../player/entities/player.entity';

@Entity()
export class MahjongYakumanRecord {
  @PrimaryGeneratedColumn()
  id: number;

  // 화료한 역만의 종류. 중첩 역만에 대응 위해 array로 저장
  @Column('varchar', { array: true })
  yakuman: MahjongYakuman[];

  // BUG: Soft delete: cascade not working
  @ManyToOne(() => MahjongGameRecord, (game) => game.yakumans, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'gameId' })
  game: MahjongGameRecord;

  @Column('int', { name: 'gameId', nullable: true })
  gameId: number;

  @Column({ nullable: true })
  round: string | null;

  @ManyToOne(() => MahjongPlayer, (player) => player.yakumans)
  winner: MahjongPlayer;

  // 방총자. 쯔모라면 null
  @ManyToOne(() => MahjongPlayer, { nullable: true })
  opponent: MahjongPlayer | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
