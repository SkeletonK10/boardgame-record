import {
  Column,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { MahjongYakuman } from '../constants/mahjong.constant';
import { MahjongPlayerRecord } from './player.record.entity';

@Entity()
export class MahjongYakumanRecord {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => MahjongPlayerRecord, (record) => record.yakumans)
  record: MahjongPlayerRecord;

  @Column('varchar', { array: true })
  yakuman: MahjongYakuman[];

  @DeleteDateColumn()
  deletedAt: Date;
}
