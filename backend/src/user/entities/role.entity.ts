import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.entity';

export enum Role {
  admin = 'ADMIN',
  mahjongRecordAdmin = 'MAHJONG_RECORD_ADMIN',
  user = 'USER',
}

@Entity({ name: 'user_role' })
export class UserRole {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  role: Role;

  @ManyToOne(() => User, (user) => user.roles, { onDelete: 'CASCADE' })
  user: User;
}
