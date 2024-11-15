import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { MahjongPlayer } from './player.entity';
import { MahjongCategory } from '../../constants/mahjong.constant';

@Entity()
export class MahjongRating {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => MahjongPlayer, (player) => player.rating, {
    onDelete: 'CASCADE',
  })
  player: MahjongPlayer;

  @Column()
  category: MahjongCategory;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  rating: number;
}
