import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { MahjongPlayerRecord } from './player-record.entity';
import { MahjongCategory, MahjongRatingCategory } from '../enum/mahjong.enum';

@Entity()
export class MahjongGameRecord {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToMany(() => MahjongPlayerRecord, (playerRecord) => playerRecord.game)
  players: MahjongPlayerRecord[];

  @Column()
  category: MahjongCategory;

  @Column()
  ratingCategory: MahjongRatingCategory;

  @Column({ type: 'text', nullable: true })
  note?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
