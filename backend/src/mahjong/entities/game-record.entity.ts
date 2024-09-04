import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { MahjongPlayerRecord } from './player-record.entity';

export enum MahjongCategory {
  east = `동풍전`,
  south = `반장전`,
  other = `기타`,
}

@Entity()
export class MahjongGameRecord {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToMany(() => MahjongPlayerRecord, (playerRecord) => playerRecord.game)
  players: MahjongPlayerRecord[];

  @Column()
  category: MahjongCategory;

  @Column({ type: 'text', nullable: true })
  note?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
