import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { MahjongPlayer } from './player.entity';
import { MahjongRatingCategory } from 'src/mahjong/enum/mahjong.enum';

@Entity()
export class MahjongRating {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => MahjongPlayer, (player) => player.rating, {
    onDelete: 'CASCADE',
  })
  player: MahjongPlayer;

  @Column()
  category: MahjongRatingCategory;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  rating: number;
}
