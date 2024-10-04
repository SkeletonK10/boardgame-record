import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.entity';

export const Role = {
  ADMIN: 'ADMIN',
  MAHJONG_RECORD_ADMIN: 'MAHJONG_RECORD_ADMIN',
  USER: 'USER',
} as const;

export type RoleType = keyof typeof Role;

@Entity({ name: 'user_role' })
export class UserRole {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  role: RoleType;

  @ManyToOne(() => User, (user) => user.roles, { onDelete: 'CASCADE' })
  user: User;
}
