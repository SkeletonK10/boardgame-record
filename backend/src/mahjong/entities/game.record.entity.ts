import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { MahjongPlayerRecord } from './player.record.entity';
import {
  MahjongCategory,
  MahjongSubcategory,
} from '../constants/mahjong.constant';

@Entity()
export class MahjongGameRecord {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToMany(() => MahjongPlayerRecord, (playerRecord) => playerRecord.game)
  players: MahjongPlayerRecord[];

  @Column()
  category: MahjongCategory;

  @Column()
  subcategory: MahjongSubcategory;

  @Column({ type: 'text', nullable: true })
  note?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
