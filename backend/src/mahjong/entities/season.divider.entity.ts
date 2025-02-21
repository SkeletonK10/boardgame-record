import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class MahjongSeasonDivider {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  season: number;

  @Column({ type: 'integer' })
  startGameId: number;

  @Column({ type: 'integer' })
  endGameId: number;
}
