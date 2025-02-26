import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class MahjongSeason {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  season: number;

  @Column()
  startDate: Date;

  @Column({ nullable: true })
  endDate: Date;
}
